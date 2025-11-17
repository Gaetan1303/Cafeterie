import { formSchemas, validateForm } from '../utils/formSchema';

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
  <input v-model.number="editQuantities[p._id]" type="number" min="1" style="width:3em;margin-left:1em;" />
  <button @click="updatePurchase(p._id)" style="margin-left:0.5em;color:#fff;background:#2d8cf0;border:none;padding:0.2em 0.7em;border-radius:4px;">Modifier</button>
  <button @click="deletePurchase(p._id)" style="margin-left:0.5em;color:#fff;background:#e74c3c;border:none;padding:0.2em 0.7em;border-radius:4px;">Supprimer</button>
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
import { useRouter } from 'vue-router';


import { apiFetch } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import { ref, computed, watchEffect } from 'vue';
import { getMyPurchases, createPurchase } from '../utils/api';
import { usePagination } from '../composables/usePagination';
import { useFormatDate } from '../composables/useFormatDate';
async function deletePurchase(id) {
  if (!id) return;
  if (!confirm('Supprimer cet achat ?')) return;
  try {
    await apiFetch(`/purchases/${id}`, { method: 'DELETE', token: userStore.token });
    toastStore.showToast('Achat supprimé', 'success');
    fetchData();
  } catch (e) {
    toastStore.showToast(e?.message || 'Erreur lors de la suppression', 'error');
  }
}


const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();
const purchase = ref({ stockItem: '', quantity: 1 });
const { data: purchasesRaw, loading, error, fetchData } = useApiFetch(getMyPurchases, [userStore.token]);
const purchases = computed(() => {
  if (!purchasesRaw.value) return [];
  if (Array.isArray(purchasesRaw.value)) return purchasesRaw.value;
  if (Array.isArray(purchasesRaw.value.data)) return purchasesRaw.value.data;
  return [];
});

const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(purchases, 5);
const { formatDateTime } = useFormatDate();
const editQuantities = ref({});
// Remplit les quantités éditables à chaque chargement
watchEffect(() => {
  for (const p of purchases.value) {
    if (!(p._id in editQuantities.value)) {
      editQuantities.value[p._id] = p.quantity;
    }
  }
});

async function updatePurchase(id) {
  if (!id) return;
  const newQty = editQuantities.value[id];
  const err = validateForm(formSchemas.purchase, {
    type: '',
    subtype: '',
    quantity: newQty
  });
  if (err) {
    toastStore.showToast(err, 'error');
    return;
  }
  try {
    await apiFetch(`/purchases/${id}`, { method: 'PUT', body: { quantity: newQty }, token: userStore.token });
    toastStore.showToast('Achat modifié', 'success');
    fetchData();
  } catch (e) {
    toastStore.showToast(e?.message || 'Erreur lors de la modification', 'error');
  }
}

function goToStock(stockId) {
  router.push({ path: '/stock', query: { id: stockId } });
}

function nextPage() {
  setPage(page.value + 1);
}
function prevPage() {
  setPage(page.value - 1);
}

async function submitPurchase() {
  const err = validateForm(formSchemas.purchase, {
    type: '',
    subtype: '',
    quantity: purchase.value.quantity
  });
  if (err) {
    toastStore.showToast(err, 'error');
    return;
  }
  try {
    await createPurchase(purchase.value, userStore.token);
    toastStore.showToast('Achat enregistré !', 'success');
    purchase.value = { stockItem: '', quantity: 1 };
    fetchData();
  } catch (e) {
    toastStore.showToast(e?.message || 'Erreur lors de l\'achat', 'error');
  }
}
</script>
