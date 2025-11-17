<template>
  <div>
    <h1>Stock</h1>
    <ul>
      <li v-for="item in pagedStock" :key="item._id">
        <b>{{ item.type }}</b> ({{ item.category }}) : {{ item.quantity }}
        <button @click="selectItem(item)">Détail</button>
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
      Page {{ page }} / {{ totalPages }}
      <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
      <span v-if="error" style="color:red">{{ error }}</span>
    </div>
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
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import { getStock, getStockItem } from '../utils/api';

const userStore = useUserStore();
const stock = ref([]);
const selected = ref(null);
const error = ref('');
const page = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(stock.value.length / pageSize));
const pagedStock = computed(() => {
  const start = (page.value - 1) * pageSize;
  return stock.value.slice(start, start + pageSize);
});

onMounted(fetchStock);

async function fetchStock() {
  error.value = '';
  try {
    stock.value = await getStock(userStore.token);
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

async function selectItem(item) {
  selected.value = await getStockItem(item._id, userStore.token);
}
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
</style>
