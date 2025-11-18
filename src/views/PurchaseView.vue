<template>
	<div>
		<h1>Mes achats</h1>
		<ul>
			<li v-for="p in paginatedItems" :key="p._id">
				{{ p.quantity }} x
				<span v-if="p.stockItem">
					<b>{{ formatStockName(p.stockItem) }}</b>
					<button @click="goToStock(p.stockItem._id)">Voir stock</button>
				</span>
				<span v-else>Item inconnu</span>
				le {{ formatDateTime(p.timestamp) }}
				<input v-model.number="editQuantities[p._id]" type="number" min="1" style="width:3em;margin-left:1em;" />
				<button @click="updatePurchase(p._id)" class="btn-modifier">Modifier</button>
				<button @click="deletePurchase(p._id)" class="btn-supprimer">Supprimer</button>
			</li>
		</ul>
		<h2>Nouvel achat</h2>
		<form @submit.prevent="submitPurchase">
			<select v-model="purchase.stockItem" required>
				<option value="" disabled>Choisir un produit</option>
				<option v-for="item in stock" :key="item._id" :value="item._id">
					{{ formatStockName(item) }}
				</option>
			</select>
			<input v-model.number="purchase.quantity" type="number" min="1" required placeholder="Quantité" />
			<button type="submit">Acheter</button>
		</form>
		<p v-if="error" class="error">{{ error }}</p>

		<hr />
		<h2>Stock disponible (magasin)</h2>
		<div class="stock-filters">
			<label>Catégorie :
				<select v-model="stockCategoryFilter">
					<option value="">Toutes</option>
					<option v-for="cat in stockCategories" :key="cat" :value="cat">{{ cat }}</option>
				</select>
			</label>
			<label>Recherche :
				<input v-model="stockSearch" placeholder="Nom, type..." />
			</label>
			<label>Trier par :
				<select v-model="stockSort">
					<option value="az">A → Z</option>
					<option value="za">Z → A</option>
					<option value="qty">Quantité croissante</option>
					<option value="qtydesc">Quantité décroissante</option>
					<option value="recent">Ajout récent</option>
				</select>
			</label>
		</div>
			<div class="store-grid">
				<div v-for="item in paginatedStock" :key="item._id" class="store-item">
					<div :style="stockColorStyle(item)">
						<b>{{ formatStockName(item) }}</b>
					</div>
					<div>
						<span>Quantité : <b :style="item.quantity <= (item.threshold ?? 0) ? 'color:red' : ''">{{ item.quantity }}</b></span>
						<span v-if="item.threshold"> / Seuil : <b>{{ item.threshold }}</b></span>
					</div>
					<div>Ajouté le <span v-if="item.createdAt || item.timestamp">{{ formatDateTime(item.createdAt || item.timestamp) }}</span><span v-else>-</span></div>
					<button @click="goToStock(item._id)">Voir détail</button>
				</div>
			</div>
		<div class="pagination">
			<button @click="prevStockPage" :disabled="stockPage === 1">&lt; Précédent</button>
			Page {{ stockPage }} / {{ stockPageCount }}
			<button @click="nextStockPage" :disabled="stockPage === stockPageCount">Suivant &gt;</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import { useApiFetch } from '../composables/useApiFetch';
import { usePagination } from '../composables/usePagination';
import { useFormatDate } from '../composables/useFormatDate';
import { formSchemas, validateForm } from '../utils/formSchema';
import { apiFetch, getStock, getMyPurchases, createPurchase } from '../utils/api';

// Stock
const { data: stockRaw } = useApiFetch(getStock, [useUserStore().token]);
const stock = computed(() => Array.isArray(stockRaw.value) ? stockRaw.value : (stockRaw.value?.data || []));
const stockCategoryFilter = ref('');
const stockSearch = ref('');
const stockSort = ref('az');
const stockPage = ref(1);
const stockPageSize = ref(8);
const formatDateTime = useFormatDate().formatDateTime;

const stockCategories = computed(() => {
	const cats = new Set();
	for (const s of stock.value) if (s.category) cats.add(s.category);
	return Array.from(cats).sort();
});

const filteredStock = computed(() => {
	let items = stock.value;
	if (stockCategoryFilter.value) items = items.filter(i => i.category === stockCategoryFilter.value);
	if (stockSearch.value) {
		const q = stockSearch.value.toLowerCase();
		items = items.filter(i =>
			(i.type && i.type.toLowerCase().includes(q)) ||
			(i.subtype && i.subtype.toLowerCase().includes(q)) ||
			(i.category && i.category.toLowerCase().includes(q))
		);
	}
	switch (stockSort.value) {
		case 'az': items = items.slice().sort((a, b) => (a.type || '').localeCompare(b.type || '')); break;
		case 'za': items = items.slice().sort((a, b) => (b.type || '').localeCompare(a.type || '')); break;
		case 'qty': items = items.slice().sort((a, b) => (a.quantity ?? 0) - (b.quantity ?? 0)); break;
		case 'qtydesc': items = items.slice().sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0)); break;
		case 'recent': items = items.slice().sort((a, b) => new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0)); break;
	}
	return items;
});

const stockPageCount = computed(() => Math.ceil(filteredStock.value.length / stockPageSize.value) || 1);
const paginatedStock = computed(() => {
	const start = (stockPage.value - 1) * stockPageSize.value;
	return filteredStock.value.slice(start, start + stockPageSize.value);
});
function nextStockPage() { if (stockPage.value < stockPageCount.value) stockPage.value++; }
function prevStockPage() { if (stockPage.value > 1) stockPage.value--; }

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

// Achats utilisateur
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
const editQuantities = ref({});
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

// Fonction utilitaire pour nom générique
function formatStockName(item) {
  if (!item) return '';
  let name = item.type ? item.type : '';
  if (item.subtype) name += ` (${item.subtype})`;
  if (item.category) name += ` - ${item.category}`;
  return name;
}
</script>

<style scoped>
.store-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5em;
	margin: 2em 0;
}
.store-item {
	border: 1px solid #eee;
	border-radius: 8px;
	padding: 1em;
	background: #fafaff;
	box-shadow: 0 2px 8px #0001;
	display: flex;
	flex-direction: column;
	gap: 0.5em;
	align-items: flex-start;
}
.pagination {
	margin: 1em 0;
}
.btn-modifier {
	margin-left: 0.5em;
	color: #fff;
	background: #2d8cf0;
	border: none;
	padding: 0.2em 0.7em;
	border-radius: 4px;
}
.btn-supprimer {
	margin-left: 0.5em;
	color: #fff;
	background: #e74c3c;
	border: none;
	padding: 0.2em 0.7em;
	border-radius: 4px;
}
.error {
	color: red;
}
.stock-filters {
	margin-bottom: 1em;
	display: flex;
	gap: 1em;
	flex-wrap: wrap;
	align-items: center;
}
</style>
