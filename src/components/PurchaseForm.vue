<template>
  <div class="purchase-container">
    <h2>Enregistrer un achat</h2>
    <form @submit.prevent="submitPurchase">
      <label>Type :</label>
  <select v-model="type" @change="onTypeChange" required>
        <option value="cafe">Café</option>
        <option value="the">Thé</option>
        <option value="nourriture">Nourriture</option>
      </select>
      <div v-if="type === 'nourriture'">
        <label>Sous-type :</label>
    <select v-model="subtype" required>
          <option value="gateau">Gâteau</option>
          <option value="viennoiserie">Viennoiserie</option>
          <option value="autre">Autre Nourriture</option>
        </select>
      </div>
      <label>Quantité :</label>
  <input v-model.number="quantity" type="number" min="1" max="5" required />
      <button type="submit">Valider</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Achat enregistré !</p>
  </div>
</template>

<script>


import { useStockMap } from '../composables/useStockMap';
import { useUserStore } from '../store/userStore';
import { createPurchase } from '../utils/api';
import { useToastStore } from '../store/toastStore';
import { sanitizeInput } from '../utils/sanitize';
import { formSchemas, validateForm } from '../utils/formSchema';

export default {
  name: 'PurchaseForm',
  data() {
    return {
      type: 'cafe',
      subtype: 'gateau',
      quantity: 1,
      error: '',
      success: false
    }
  },
  setup() {
    const { stockMap, loading, fetchData } = useStockMap();
    const userStore = useUserStore();
  const toastStore = useToastStore();
  return { stockMap, loading, fetchData, userStore, toastStore };
  },
  methods: {
    onTypeChange() {
      if (this.type !== 'nourriture') this.subtype = ''
    },
    async submitPurchase() {
      this.error = '';
      this.success = false;
      const err = validateForm(formSchemas.purchase, {
        type: this.type,
        subtype: this.type === 'nourriture' ? this.subtype : '',
        quantity: this.quantity
      });
      if (err) {
        this.error = err;
        this.toastStore.showToast(this.error, 'error');
        return;
      }
      // Vérification du stock disponible avant appel API
      const key = this.type + '|' + (this.type === 'nourriture' ? this.subtype : '');
      const item = this.stockMap[key];
      if (!item) {
        this.error = "Produit non trouvé dans le stock.";
        this.toastStore.showToast(this.error, 'error');
        return;
      }
      if (item.quantity < this.quantity) {
        this.error = `Stock insuffisant : il reste ${item.quantity} unité(s).`;
        this.toastStore.showToast(this.error, 'error');
        return;
      }
      try {
        // Sanitize les champs texte (type, subtype)
        const safeType = sanitizeInput(this.type);
        const safeSubtype = this.type === 'nourriture' ? sanitizeInput(this.subtype) : null;
        await createPurchase({ stockItem: item._id, quantity: this.quantity, type: safeType, subtype: safeSubtype }, this.userStore.token);
        this.success = true;
        this.toastStore.showToast('Achat enregistré !', 'success');
        this.type = 'cafe';
        this.subtype = 'gateau';
        this.quantity = 1;
        this.fetchData(); // Rafraîchir le stock
      } catch (e) {
        this.error = e?.message || 'Erreur lors de l\'achat';
        this.toastStore.showToast(this.error, 'error');
      }
    }
  }
}
</script>

<style scoped>
.purchase-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
label { display: block; margin-top: 1rem; }
select, input[type=number] { width: 100%; padding: 0.5rem; margin-bottom: 1rem; }
button { width: 100%; padding: 0.7rem; background: #42b983; color: #fff; border: none; border-radius: 4px; }
.error { color: #e74c3c; margin-top: 1rem; }
.success { color: #27ae60; margin-top: 1rem; }
</style>
