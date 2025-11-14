<template>
  <div>
    <h1>Mes achats</h1>
    <ul>
      <li v-for="p in purchases" :key="p._id">
        {{ p.quantity }} x {{ p.stockItem?.type || 'Item inconnu' }} le {{ new Date(p.timestamp).toLocaleString() }}
      </li>
    </ul>
    <h2>Nouvel achat</h2>
    <form @submit.prevent="submitPurchase">
      <input v-model="purchase.stockItem" placeholder="ID de l'item" />
      <input v-model.number="purchase.quantity" type="number" min="1" placeholder="Quantité" />
      <button type="submit">Acheter</button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getMyPurchases, createPurchase } from '../utils/api';
import { useStore } from '../store';

const store = useStore();
const purchases = ref([]);
const purchase = ref({ stockItem: '', quantity: 1 });

onMounted(async () => {
  purchases.value = await getMyPurchases(store.token);
});

async function submitPurchase() {
  await createPurchase(purchase.value, store.token);
  purchases.value = await getMyPurchases(store.token);
  purchase.value = { stockItem: '', quantity: 1 };
}
</script>
