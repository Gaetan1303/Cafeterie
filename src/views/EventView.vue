<template>
  <div>
    <h1>Évènements</h1>
    <ul>
      <li v-for="e in events" :key="e._id">
        <b>{{ e.title }}</b> le {{ new Date(e.date).toLocaleString() }}
        <button @click="selectEvent(e)">Détail</button>
        <button v-if="!isParticipant(e)" @click="participate(e)">Participer</button>
        <button v-else @click="unparticipate(e)">Se désinscrire</button>
      </li>
    </ul>
    <div v-if="selected">
      <h2>{{ selected.title }}</h2>
      <p>{{ selected.description }}</p>
      <p>Participants : {{ selected.participants.length }} / {{ selected.maxParticipants }}</p>
      <button @click="selected = null">Fermer</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getEvents, getEvent, participateEvent, unparticipateEvent } from '../utils/api';
import { useStore } from '../store';

const store = useStore();
const events = ref([]);
const selected = ref(null);

onMounted(async () => {
  events.value = await getEvents(store.token);
});

function isParticipant(event) {
  return event.participants.includes(store.userId);
}

async function selectEvent(e) {
  selected.value = await getEvent(e._id, store.token);
}

async function participate(e) {
  await participateEvent(e._id, store.token);
  events.value = await getEvents(store.token);
}

async function unparticipate(e) {
  await unparticipateEvent(e._id, store.token);
  events.value = await getEvents(store.token);
}
</script>
