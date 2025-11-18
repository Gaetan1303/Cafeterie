<template>
  <div>
    <h1>Évènements</h1>
    <form @submit.prevent="createEvent" style="margin-bottom:2em;">
      <h2>Créer un évènement</h2>
      <label>Titre : <input v-model="newEvent.title" required /></label><br />
      <label>Description : <input v-model="newEvent.description" /></label><br />
      <label>Date : <input v-model="newEvent.date" type="datetime-local" required /></label><br />
      <label>Max participants : <input v-model.number="newEvent.maxParticipants" type="number" min="1" /></label><br />
      <button type="submit">Créer</button>
      <span v-if="formError" class="error">{{ formError }}</span>
    </form>
    <ul>
      <li v-for="e in paginatedItems" :key="e._id">
        <b>{{ e.title }}</b> le {{ formatDateTime(e.date) }}
        <button @click="selectEvent(e)">Détail</button>
        <button v-if="!isParticipant(e)" @click="participate(e)">Participer</button>
        <button v-else @click="unparticipate(e)">Se désinscrire</button>
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <span v-if="error" style="color:red">{{ error.message || error }}</span>
      <span v-if="loading">Chargement...</span>
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
const newEvent = ref({
  title: '',
  description: '',
  date: '',
  maxParticipants: 10
});
const formError = ref('');

function createEvent() {
  formError.value = '';
  if (!newEvent.value.title) {
    formError.value = 'Titre obligatoire';
    return;
  }
  if (!newEvent.value.date || new Date(newEvent.value.date) < new Date()) {
    formError.value = 'Date invalide';
    return;
  }
  // Ajoute l'évènement localement (mock)
  eventsRaw.value.push({
    _id: Math.random().toString(36).slice(2),
    title: newEvent.value.title,
    description: newEvent.value.description,
    date: newEvent.value.date,
    participants: [],
    maxParticipants: newEvent.value.maxParticipants
  });
  newEvent.value = { title: '', description: '', date: '', maxParticipants: 10 };
}
import { ref, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { getEvents, getEvent, participateEvent, unparticipateEvent } from '../utils/api';
import { useApiFetch } from '../composables/useApiFetch';
import { usePagination } from '../composables/usePagination';
import { useFormatDate } from '../composables/useFormatDate';

const userStore = useUserStore();
const selected = ref(null);
const { data: eventsRaw, loading, error, fetchData } = useApiFetch(getEvents, [userStore.token]);
const events = computed(() => Array.isArray(eventsRaw.value) ? eventsRaw.value : (eventsRaw.value?.data || []));
const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(events, 5);
const { formatDateTime } = useFormatDate();

function nextPage() {
  setPage(page.value + 1);
}
function prevPage() {
  setPage(page.value - 1);
}

function isParticipant(event) {
  return userStore.user && event.participants.includes(userStore.user._id);
}

async function selectEvent(e) {
  selected.value = await getEvent(e._id, userStore.token);
}

async function participate(e) {
  await participateEvent(e._id, userStore.token);
  fetchData();
}

async function unparticipate(e) {
  await unparticipateEvent(e._id, userStore.token);
  fetchData();
}
</script>
