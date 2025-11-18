<template>
  <div>
    <h1>Stock</h1>
    <ul>
      <li v-for="item in paginatedItems" :key="item._id">
        <span :style="stockColorStyle(item)">
          <b>{{ item.type }}</b> ({{ item.category }}) : {{ item.quantity }}
        </span>
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
      <div v-if="userStore.user?.role === 'admin'">
        <h3>Réapprovisionnement</h3>
        <form @submit.prevent="handleRestock">
          <input type="number" v-model.number="restockQty" min="1" placeholder="Quantité à ajouter" required />
          <button type="submit" :disabled="restockLoading">Réapprovisionner</button>
        </form>
        <span v-if="restockLoading">Réapprovisionnement...</span>
        <span v-if="restockSuccess" style="color:green">Stock mis à jour !</span>
        <span v-if="restockError" style="color:red">{{ restockError }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>



import { ref, computed } from 'vue';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import { validateQuantity } from '../utils/validation';
import { useApiFetch } from '../composables/useApiFetch';
import { getStock, getStockItem, restockStockItem } from '../utils/api';

import { usePagination } from '../composables/usePagination';

import { useRouter } from 'vue-router';

const router = useRouter();

// Gestion d'erreur globale pour éviter le plantage du site
try {

} catch (e) {
  // Affiche une erreur utilisateur et redirige vers l'accueil
  const toastStore = useToastStore();
  toastStore.showToast('Erreur critique dans la vue Stock. Redirection...', 'error');
  setTimeout(() => {
    router.push('/');
  }, 1000);
}

const userStore = useUserStore();
const toastStore = useToastStore();
const selected = ref(null);
const { data: stockRaw, loading, error, fetchData } = useApiFetch(getStock, [userStore.token]);
const stock = computed(() => Array.isArray(stockRaw.value) ? stockRaw.value : (stockRaw.value?.data || []));
const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(stock, 5);
// totalPages pour compatibilité avec le template
const totalPages = pageCount;

function stockColorStyle(item) {
  if (typeof item.quantity !== 'number' || typeof item.threshold !== 'number') return {};
  if (item.quantity > item.threshold * 2) {
    return { color: 'green', fontWeight: 'bold' };
  } else if (item.quantity > item.threshold) {
    return { color: 'orange', fontWeight: 'bold' };
  } else {
    return { color: 'red', fontWeight: 'bold' };
  }
}

const restockQty = ref(1);
const restockLoading = ref(false);
const restockSuccess = ref(false);
const restockError = ref('');

function nextPage() {
  setPage(page.value + 1);
}
function prevPage() {
  setPage(page.value - 1);
}

async function selectItem(item) {
  restockSuccess.value = false;
  restockError.value = '';
  restockQty.value = 1;
  selected.value = await getStockItem(item._id, userStore.token);
}

async function handleRestock() {
  if (!selected.value) return;
  if (!validateQuantity(restockQty.value)) {
    restockError.value = 'Quantité invalide (1-100)';
    toastStore.showToast(restockError.value, 'error');
    return;
  }
  restockLoading.value = true;
  restockSuccess.value = false;
  restockError.value = '';
  try {
    await restockStockItem(selected.value._id, restockQty.value, userStore.token);
    restockSuccess.value = true;
    toastStore.showToast('Stock réapprovisionné !', 'success');
    await fetchData();
    // Rafraîchir l'item sélectionné
    selected.value = await getStockItem(selected.value._id, userStore.token);
  } catch (e) {
    restockError.value = e?.message || 'Erreur lors du réapprovisionnement';
    toastStore.showToast(restockError.value, 'error');
  } finally {
    restockLoading.value = false;
  }
}
</script>
