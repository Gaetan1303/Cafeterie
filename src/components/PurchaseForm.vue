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
  methods: {
    onTypeChange() {
      if (this.type !== 'nourriture') this.subtype = ''
    },
    async submitPurchase() {
      this.error = ''
      this.success = false
      const allowedTypes = ['cafe', 'the', 'nourriture']
      const allowedSubtypes = ['gateau', 'viennoiserie', 'autre']
      if (!allowedTypes.includes(this.type)) {
        this.error = 'Type invalide.'
        return
      }
      if (this.type === 'nourriture' && !allowedSubtypes.includes(this.subtype)) {
        this.error = 'Sous-type invalide.'
        return
      }
      if (this.quantity < 1 || this.quantity > 5) {
        this.error = 'Quantité invalide (1 à 5).'
        return
      }
      try {
        const token = localStorage.getItem('token')
  const response = await fetch('/purchases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            type: this.type,
            subtype: this.type === 'nourriture' ? this.subtype : null,
            quantity: this.quantity
          })
        })
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Erreur lors de l\'achat'
          return
        }
        this.success = true
        this.type = 'cafe'
        this.subtype = 'gateau'
        this.quantity = 1
      } catch (e) {
        this.error = "Erreur réseau ou serveur."
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
