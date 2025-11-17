<template>
  <div class="history-container">
    <h2>Mon historique d'achats</h2>
    <form class="filters" @submit.prevent="fetchHistory">
      <label>Type :</label>
      <select v-model="filterType">
        <option value="">Tous</option>
        <option value="cafe">Café</option>
        <option value="the">Thé</option>
        <option value="nourriture">Nourriture</option>
      </select>
      <label>Date :</label>
      <input v-model="filterDate" type="date" />
      <button type="submit">Filtrer</button>
    </form>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Sous-type</th>
          <th>Quantité</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>{{ formatDate(item.timestamp) }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.subtype || '-' }}</td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="isAdmin" class="admin-history">
        <h3>Historique global des mouvements de stock (admin)</h3>
        <button @click="fetchStockHistory">Charger l'historique global</button>
        <table v-if="stockHistory.length">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Type</th>
              <th>Sous-type</th>
              <th>Catégorie</th>
              <th>Quantité</th>
              <th>Utilisateur</th>
              <th>Auteur</th>
              <th>Raison</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in stockHistory" :key="h._id">
              <td>{{ formatDate(h.date) }}</td>
              <td>{{ h.action }}</td>
              <td>{{ h.item?.type || '-' }}</td>
              <td>{{ h.item?.subtype || '-' }}</td>
              <td>{{ h.item?.category || '-' }}</td>
              <td>{{ h.quantity }}</td>
              <td>{{ h.user ? h.user.email : '-' }}</td>
              <td>{{ h.auteur ? h.auteur.email : '-' }}</td>
              <td>{{ h.reason || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:1em">
          <label>ID d'un item :</label>
          <input v-model="itemId" placeholder="ID de l'item" />
          <button @click="fetchItemHistory">Voir historique de l'item</button>
        </div>
        <table v-if="itemHistory.length">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Quantité</th>
              <th>Utilisateur</th>
              <th>Auteur</th>
              <th>Raison</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in itemHistory" :key="h._id">
              <td>{{ formatDate(h.date) }}</td>
              <td>{{ h.action }}</td>
              <td>{{ h.quantity }}</td>
              <td>{{ h.user ? h.user.email : '-' }}</td>
              <td>{{ h.auteur ? h.auteur.email : '-' }}</td>
              <td>{{ h.reason || '-' }}</td>
            </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>

import { useToastStore } from '../store/toastStore';

const userStore = useUserStore();
const toastStore = useToastStore();
const filterType = ref('');
const filterDate = ref('');
const { formatDate } = useFormatDate();
const isAdmin = computed(() => userStore.user?.role === 'admin');

// Historique utilisateur
const { data: historyRaw, loading, error, fetchData } = useApiFetch(fetchHistoryApi, [filterType, filterDate, userStore.token], { autoFetch: false });
const history = computed(() => Array.isArray(historyRaw.value) ? historyRaw.value : (historyRaw.value?.data || []));
const { page, pageSize, pageCount, paginatedItems, setPage } = usePagination(history, 10);

// Historique global admin
const { data: allHistoryRaw, loading: loadingAll, error: errorAll, fetchData: fetchAllHistory } = useApiFetch(fetchAllHistoryApi, [userStore.token], { autoFetch: false });
const allHistory = computed(() => Array.isArray(allHistoryRaw.value) ? allHistoryRaw.value : (allHistoryRaw.value?.data || []));

async function fetchHistoryApi(type, date, token) {
  let url = '/purchases/me?';
  if (type) url += `type=${type}&`;
  if (date) url += `date=${date}`;
  try {
    const res = await apiFetch(url, { token });
    toastStore.showToast('Historique chargé', 'success');
    return res;
  } catch (e) {
    toastStore.showToast(e?.message || 'Erreur lors du chargement de l\'historique', 'error');
    throw e;
  }
}

async function fetchAllHistoryApi(token) {
  try {
    const res = await apiFetch('/purchases', { token });
    toastStore.showToast('Historique global chargé', 'success');
    return res;
  } catch (e) {
    toastStore.showToast(e?.message || 'Erreur lors du chargement global', 'error');
    throw e;
  }
}

fetchData();
</script>

<style scoped>
.history-container { max-width: 800px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
th, td { border: 1px solid #eee; padding: 0.5rem; text-align: center; }
.filters { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.error { color: #e74c3c; margin-top: 1rem; }
.admin-history { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; }
</style>
