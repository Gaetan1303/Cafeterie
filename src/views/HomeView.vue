

<template>
  <div>
    <h2>Accueil</h2>
    <!-- Événements en cours -->

    <section>
      <h3>Événements en cours</h3>
      <ul>
        <li v-for="event in upcomingEvents" :key="event._id">
          <b>{{ event.title }}</b> le {{ formatDateTime(event.date) }}
          <span v-if="isParticipant(event)" style="color:green">(Inscrit)</span>
          <button v-else @click="participate(event)">Participer</button>
        </li>
      </ul>
      <p v-if="upcomingEvents.length === 0">Aucun événement en cours.</p>
    </section>

    <!-- Alertes -->
    <section style="margin-top:2em">
      <h3>Alertes</h3>
      <ul>
        <li v-for="alert in sortedAlerts" :key="alert.id" :style="alert.critical ? 'color:red;font-weight:bold' : ''">
          <span v-if="alert.critical">[CRITIQUE] </span>{{ alert.message }}
        </li>
      </ul>
      <p v-if="sortedAlerts.length === 0">Aucune alerte.</p>
    </section>

    <!-- Allumer les machines -->
    <section style="margin-top:2em">
      <h3>Allumer une machine</h3>
      <div v-if="machines.length">
        <div v-for="machine in paginatedMachines" :key="machine._id" class="machine-card">
          <b>{{ machine.name }}</b> ({{ machine.type }}) - {{ machine.state }}<br />
          Capacité : {{ machine.capacity }} {{ machine.unit }}<br />
          <label>Tickets :
            <input type="number" v-model.number="machineTickets[machine._id]" :min="1" :max="machine.capacity" style="width:4em" />
          </label>
          <button @click="startMachine(machine)">Démarrer</button>
          <button @click="quickStart(machine)">Mode rapide (max)</button>
          <span v-if="machineMessages[machine._id]" style="margin-left:1em;color:green">{{ machineMessages[machine._id] }}</span>
        </div>
        <div style="margin:1em 0;">
          <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
          Page {{ page }} / {{ totalPages }}
          <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
        </div>
      </div>
      <p v-else>Aucune machine disponible.</p>
    </section>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import { getEvents, participateEvent, getMachines, useMachine } from '../utils/api';
import { useFormatDate } from '../composables/useFormatDate';

const userStore = useUserStore();
const { formatDateTime } = useFormatDate();


// Événements
const events = ref([]);
const now = () => new Date();
const upcomingEvents = computed(() =>
  events.value.filter(e => e.title && new Date(e.date) > now())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);
async function fetchEvents() {
  events.value = await getEvents(userStore.token) || [];
}
function isParticipant(event) {
  return userStore.user && event.participants && event.participants.includes(userStore.user._id);
}
async function participate(event) {
  await participateEvent(event._id, userStore.token);
  fetchEvents();
}

// Alertes dynamiques
const staticAlerts = ref([
  { id: 1, message: 'Stock café très bas !', critical: true }
]);
const machineAlerts = computed(() =>
  machines.value
    .filter(m => m.state && m.state.toLowerCase() !== 'disponible')
    .map(m => ({ id: 'm-' + m._id, message: `Machine ${m.name} en ${m.state}`, critical: false }))
);
const eventAlerts = computed(() => {
  // Ex : événement imminent (dans l'heure)
  const alerts = [];
  const nowDate = now();
  upcomingEvents.value.forEach(e => {
    const diff = (new Date(e.date) - nowDate) / (1000 * 60); // minutes
    if (diff > 0 && diff <= 60) {
      alerts.push({ id: 'e-' + e._id, message: `Evénement "${e.title}" dans ${Math.round(diff)} min`, critical: false });
    }
  });
  return alerts;
});
const sortedAlerts = computed(() => [
  ...staticAlerts.value,
  ...machineAlerts.value,
  ...eventAlerts.value
].sort((a, b) => b.critical - a.critical));

// Machines
const machines = ref([]);
const machineTickets = ref({});
const machineMessages = ref({});
const page = ref(1);
const pageSize = 3;
const totalPages = computed(() => Math.ceil(machines.value.length / pageSize));
const paginatedMachines = computed(() => machines.value.slice((page.value-1)*pageSize, page.value*pageSize));

async function fetchMachines() {
  machines.value = await getMachines(userStore.token) || [];
  machines.value.forEach(m => {
    if (!(m._id in machineTickets.value)) machineTickets.value[m._id] = 1;
  });
}
function prevPage() { if (page.value > 1) page.value--; }
function nextPage() { if (page.value < totalPages.value) page.value++; }

async function startMachine(machine) {
  const tickets = machineTickets.value[machine._id] || 1;
  await useMachine(machine._id, { tickets }, userStore.token);
  machineMessages.value[machine._id] = `${tickets} ticket(s) utilisé(s)`;
}
async function quickStart(machine) {
  machineTickets.value[machine._id] = machine.capacity;
  await startMachine(machine);
}

onMounted(() => {
  fetchEvents();
  fetchMachines();
});
</script>

<style scoped>
.machine-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1em;
  margin-bottom: 1em;
  background: #fafaff;
  box-shadow: 0 2px 8px #0001;
}
</style>
