<template>
  <div>
    <h1>Évènements</h1>
    <ul>
      <li v-for="e in pagedEvents" :key="e._id">
        <b>{{ e.title }}</b> le {{ new Date(e.date).toLocaleString() }}
        <button @click="selectEvent(e)">Détail</button>
        <button v-if="!isParticipant(e)" @click="participate(e)">Participer</button>
        <button v-else @click="unparticipate(e)">Se désinscrire</button>
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
      Page {{ page }} / {{ totalPages }}
      <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
      <span v-if="error" style="color:red">{{ error }}</span>
    </div>
    <div v-if="selected">
      <h2>{{ selected.title }}</h2>
      <p>{{ selected.description }}</p>
      <p>Participants : {{ selected.participants.length }} / {{ selected.maxParticipants }}</p>
      <button @click="selected = null">Fermer</button>
    </div>
  </div>
</template>
<script setup>

import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import { getEvents, getEvent, participateEvent, unparticipateEvent } from '../utils/api';

const userStore = useUserStore();
const events = ref([]);
const selected = ref(null);
const error = ref('');
const page = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(events.value.length / pageSize));
const pagedEvents = computed(() => {
  const start = (page.value - 1) * pageSize;
  return events.value.slice(start, start + pageSize);
});

onMounted(fetchEvents);

async function fetchEvents() {
  error.value = '';
  try {
    events.value = await getEvents(userStore.token);
  } catch (e) {
    error.value = 'Erreur réseau ou serveur.';
  }
}

function nextPage() {
  if (page.value < totalPages.value) page.value++;
}
function prevPage() {
  if (page.value > 1) page.value--;
}

function isParticipant(event) {
  // On suppose que l'id utilisateur est dans userStore.user._id
  return userStore.user && event.participants.includes(userStore.user._id);
}

async function selectEvent(e) {
  selected.value = await getEvent(e._id, userStore.token);
}

async function participate(e) {
  await participateEvent(e._id, userStore.token);
  events.value = await getEvents(userStore.token);
}

async function unparticipate(e) {
  await unparticipateEvent(e._id, userStore.token);
  events.value = await getEvents(userStore.token);
}
</script>
