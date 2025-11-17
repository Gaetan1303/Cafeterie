<template>
  <div>
    <h1>Machines</h1>
    <ul>
      <li v-for="m in paginatedMachines" :key="m._id" class="machine-card">
        <b>{{ m.name }}</b> ({{ m.type }}) - <span :style="m.state !== 'disponible' ? 'color:red' : ''">{{ m.state }}</span><br />
        <span class="desc">Capacité : {{ m.capacity }} {{ m.unit }} — Peut préparer jusqu'à {{ m.capacity }} tasses par cycle.</span><br />
        <button @click="selectMachine(m)">Lancer</button>
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
      Page {{ page }} / {{ totalPages }}
      <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
        <span v-if="error" style="color:red">{{ error }}</span>
    </div>
    <div v-if="selected" class="machine-modal">
      <h2>{{ selected.name }}</h2>
      <p>Type : {{ selected.type }}</p>
      <p>État : <span :style="selected.state !== 'disponible' ? 'color:red' : ''">{{ selected.state }}</span></p>
      <p>Capacité : {{ selected.capacity }} {{ selected.unit }} — Peut préparer jusqu'à {{ selected.capacity }} tasses par cycle.</p>
      <div v-if="selected.consumables && selected.consumables.length" style="margin:1em 0;">
        <h3>Consommables associés :</h3>
        <ul>
          <li v-for="c in selected.consumables" :key="c._id || c.name">
            <b>{{ c.name }}</b>
            <span v-if="c.stockRef">—
              <span v-if="c.stockRef.type">{{ c.stockRef.type }}</span>
              <span v-if="c.stockRef.category">({{ c.stockRef.category }})</span>
            </span>
            : {{ c.quantity }} {{ c.unit }}
            <button v-if="c.stockRef && c.stockRef._id" @click="goToStock(c.stockRef._id)">Voir stock</button>
          </li>
        </ul>
      </div>
      <div class="mode-section">
        <h3>Mode Rapide</h3>
        <p>Remplit la machine avec le nombre maximum de tasses ({{ selected.capacity }}).</p>
        <button @click="amountToFill = selected.capacity; remplirEtUtiliserMachine()">Lancer (max)</button>
        <span v-if="apiMessage && amountToFill === selected.capacity" style="margin-left:1em;color:green">{{ apiMessage }}</span>
      </div>
      <div class="mode-section">
        <h3>Mode Manuel</h3>
        <label>Nombre de tasses à préparer :
          <input type="number" v-model.number="amountToFill" min="1" :max="selected.capacity" style="width:5em;" />
        </label>
        <button @click="remplirEtUtiliserMachine" :disabled="amountToFill < 1">Lancer</button>
        <span v-if="apiMessage && amountToFill !== selected.capacity" style="margin-left:1em;color:green">{{ apiMessage }}</span>
      </div>
      <p v-if="lastCups !== null">Tasses préparées : <b>{{ lastCups }}</b></p>
      <p v-if="lastTickets !== null">Tickets générés : <b>{{ lastTickets }}</b></p>
      <button @click="selected = null">Fermer</button>
    </div>
<style scoped>
.machine-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  background: #fafaff;
  box-shadow: 0 2px 8px #0001;
}
.desc {
  color: #555;
  font-size: 0.95em;
}
.machine-modal {
  border: 2px solid #2d8cf0;
  border-radius: 10px;
  background: #fff;
  padding: 2em;
  margin-top: 2em;
  max-width: 500px;
}
.mode-section {
  margin: 1.5em 0;
  padding: 1em;
  background: #f6f8ff;
  border-radius: 6px;
}
</style>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { getMachines, getMachine, useMachine } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { fillMachine } from '../services/machineService';
import { useApiFetch } from '../composables/useApiFetch';
import { usePagination } from '../composables/usePagination';
import { useFormatDate } from '../composables/useFormatDate';

const router = useRouter();
const userStore = useUserStore();
const selected = ref(null);
const fillLevel = ref(0);
const amountToFill = ref(0);
const lastTickets = ref(null);
const lastCups = ref(null);
const apiMessage = ref('');

// Appel API SOLID
import { watch, computed } from 'vue';
const machines = ref([]);
const error = ref('');
if (userStore.token) {
  getMachines(userStore.token)
    .then(data => {
      if (Array.isArray(data)) {
        machines.value = data;
      } else if (data && Array.isArray(data.machines)) {
        machines.value = data.machines;
      } else {
        machines.value = [];
      }
    })
    .catch(e => { error.value = e?.message || 'Erreur lors du chargement des machines.'; });
} else {
  error.value = 'Veuillez vous connecter pour voir les machines.';
}
const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(machines, 5);
const { formatDate } = useFormatDate();

function goToStock(stockId) {
  router.push({ path: '/stock', query: { id: stockId } });
}

async function selectMachine(m) {
  selected.value = await getMachine(m._id, userStore.token);
  fillLevel.value = 0;
  amountToFill.value = 0;
  lastTickets.value = null;
  lastCups.value = null;
}

async function remplirEtUtiliserMachine() {
  if (!selected.value) return;
  apiMessage.value = '';
  // Si la quantité est invalide, on ne fait rien et on réinitialise les compteurs
  if (!amountToFill.value || amountToFill.value < 1) {
    lastCups.value = null;
    lastTickets.value = null;
    return;
  }
  // Simulation locale (optionnel)
  const machine = {
    ...selected.value,
    fillLevel: fillLevel.value,
    ticketPerUnit: selected.value.ticketPerUnit || 1
  };
  const { tickets, newFillLevel, filled } = fillMachine(machine, amountToFill.value);
  fillLevel.value = newFillLevel;
  lastTickets.value = tickets;
  lastCups.value = filled;
  try {
    const res = await useMachine(selected.value._id, { quantity: filled, AuteurId: userStore.user?.id }, userStore.token);
    apiMessage.value = res.message || 'Préparation effectuée.';
  } catch (e) {
    apiMessage.value = e.message || 'Erreur lors de l\'utilisation de la machine.';
  }
  amountToFill.value = 0;
}

function nextPage() {
  setPage(page.value + 1);
}
function prevPage() {
  setPage(page.value - 1);
}
</script>
