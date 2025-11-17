<template>
  <div>
    <h1>Mes achats</h1>
    <ul>
      <li v-for="p in purchases" :key="p._id">
        {{ p.quantity }} x
        <span v-if="p.stockItem">
          <b>{{ p.stockItem.type }}</b>
          <span v-if="p.stockItem.subtype">({{ p.stockItem.subtype }})</span>
          <span v-if="p.stockItem.category">- {{ p.stockItem.category }}</span>
          <button @click="goToStock(p.stockItem._id)">Voir stock</button>
        </span>
        <span v-else>Item inconnu</span>
        le {{ new Date(p.timestamp).toLocaleString() }}
      </li>
    </ul>
    <div style="margin: 1em 0;">
      <button @click="prevPage" :disabled="page === 1">&lt; Précédent</button>
      Page {{ page }} / {{ totalPages }}
      <button @click="nextPage" :disabled="page === totalPages">Suivant &gt;</button>
    </div>
    <h2>Nouvel achat</h2>
    <form @submit.prevent="submitPurchase">
      <input v-model="purchase.stockItem" placeholder="ID de l'item" />
      <input v-model.number="purchase.quantity" type="number" min="1" placeholder="Quantité" />
      <button type="submit">Acheter</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

function goToStock(stockId) {
  router.push({ path: '/stock', query: { id: stockId } });
}
import { useUserStore } from '../store/userStore';
import { apiFetch, createPurchase } from '../utils/api';

const userStore = useUserStore();
const purchases = ref([]);
const page = ref(1);
const pageSize = 5;
const totalPages = ref(1);
const total = ref(0);
const error = ref('');
const purchase = ref({ stockItem: '', quantity: 1 });

async function fetchPurchases() {
  error.value = '';
  try {
    const res = await apiFetch('/purchases/me?page=' + page.value + '&limit=' + pageSize, { token: userStore.token });
    purchases.value = res.data;
    totalPages.value = res.totalPages;
    total.value = res.total;
  } catch (e) {
    error.value = 'Erreur réseau ou serveur.';
  }
}

onMounted(fetchPurchases);

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++;
    fetchPurchases();
  }
}
function prevPage() {
  if (page.value > 1) {
    page.value--;
    fetchPurchases();
  }
}

async function submitPurchase() {
  error.value = '';
  try {
    await createPurchase(purchase.value, userStore.token);
    purchase.value = { stockItem: '', quantity: 1 };
    fetchPurchases();
  } catch (e) {
    error.value = 'Erreur lors de l\'achat.';
  }
}
</script>
