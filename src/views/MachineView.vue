<template>
  <div>
    <h1>Machines</h1>
    <ul>
      <li v-for="m in pagedMachines" :key="m._id">
        <b>{{ m.name }}</b> ({{ m.type }}) - {{ m.state }}
        <button @click="selectMachine(m)">Détail</button>
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
      Page {{ page }} / {{ totalPages }}
      <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
        <span v-if="error" style="color:red">{{ error }}</span>
    </div>
    <div v-if="selected">
      <h2>{{ selected.name }}</h2>
      <p>Type : {{ selected.type }}</p>
      <p>État : {{ selected.state }}</p>
      <p>Capacité : {{ selected.capacity }} {{ selected.unit }}</p>
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
      <div style="margin:1em 0;">
        <label>Remplir la machine&nbsp;:
          <input type="number" v-model.number="amountToFill" min="1" :max="selected.capacity - fillLevel" style="width:5em;" /> {{ selected.unit }}
        </label>
        <button @click="remplirEtUtiliserMachine" :disabled="amountToFill < 1 || fillLevel >= selected.capacity">Remplir &amp; Utiliser</button>
      </div>
      <p>Niveau actuel : {{ fillLevel }} / {{ selected.capacity }} {{ selected.unit }}</p>
      <p v-if="lastCups !== null">Tasses préparées : <b>{{ lastCups }}</b></p>
      <p v-if="lastTickets !== null">Tickets générés : <b>{{ lastTickets }}</b></p>
      <p v-if="apiMessage">{{ apiMessage }}</p>
      <button @click="selected = null">Fermer</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function goToStock(stockId) {
  router.push({ path: '/stock', query: { id: stockId } });
}
import { ref, computed, onMounted } from 'vue';
import { getMachines, getMachine, useMachine } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { fillMachine } from '../services/machineService';

const userStore = useUserStore();
const machines = ref([]);
const error = ref('');
const selected = ref(null);
const fillLevel = ref(0);
const amountToFill = ref(0);
const lastTickets = ref(null);
const lastCups = ref(null);
const apiMessage = ref('');

// Pagination
const page = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(machines.value.length / pageSize));
const pagedMachines = computed(() => {
  const start = (page.value - 1) * pageSize;
  return machines.value.slice(start, start + pageSize);
});

function nextPage() {
  if (page.value < totalPages.value) page.value++;
}
function prevPage() {
  if (page.value > 1) page.value--;
}

onMounted(fetchMachines);

async function fetchMachines() {
  error.value = '';
  try {
    machines.value = await getMachines(userStore.token);
  } catch (e) {
    error.value = 'Erreur réseau ou serveur.';
  }


async function selectMachine(m) {
  selected.value = await getMachine(m._id, userStore.token);
  fillLevel.value = 0;
  amountToFill.value = 0;
  lastTickets.value = null;
}

async function remplirEtUtiliserMachine() {
  if (!selected.value) return;
  apiMessage.value = '';
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
  // Appel API pour générer les tickets/tasses côté back
  try {
    const res = await useMachine(selected.value._id, { quantity: filled, AuteurId: userStore.user?.id }, userStore.token);
    apiMessage.value = res.message || 'Préparation effectuée.';
  } catch (e) {
    apiMessage.value = e.message || 'Erreur lors de l\'utilisation de la machine.';
  }
  amountToFill.value = 0;
}
</script>
