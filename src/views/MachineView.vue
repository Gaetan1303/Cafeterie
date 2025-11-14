<template>
  <div>
    <h1>Machines</h1>
    <ul>
      <li v-for="m in machines" :key="m._id">
        <b>{{ m.name }}</b> ({{ m.type }}) - {{ m.state }}
        <button @click="selectMachine(m)">Détail</button>
      </li>
    </ul>
    <div v-if="selected">
      <h2>{{ selected.name }}</h2>
      <p>Type : {{ selected.type }}</p>
      <p>État : {{ selected.state }}</p>
      <p>Capacité : {{ selected.capacity }} {{ selected.unit }}</p>
      <button @click="selected = null">Fermer</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getMachines, getMachine } from '../utils/api';
import { useStore } from '../store';

const store = useStore();
const machines = ref([]);
const selected = ref(null);

onMounted(async () => {
  machines.value = await getMachines(store.token);
});

async function selectMachine(m) {
  selected.value = await getMachine(m._id, store.token);
}
</script>
