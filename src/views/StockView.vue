<template>
  <div>
    <h1>Stock</h1>
    <ul>
      <li v-for="item in stock" :key="item._id">
        <b>{{ item.type }}</b> ({{ item.category }}) : {{ item.quantity }}
        <button @click="selectItem(item)">Détail</button>
      </li>
    </ul>
    <div v-if="selected">
      <h2>{{ selected.type }}</h2>
      <p>Catégorie : {{ selected.category }}</p>
      <p>Quantité : {{ selected.quantity }}</p>
      <p>Seuil : {{ selected.threshold }}</p>
      <button @click="selected = null">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStock, getStockItem } from '../utils/api';
import { useStore } from '../store';

const store = useStore();
const stock = ref([]);
const selected = ref(null);

onMounted(async () => {
  stock.value = await getStock(store.token);
});

async function selectItem(item) {
  selected.value = await getStockItem(item._id, store.token);
}
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
</style>
