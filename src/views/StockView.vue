<template>
  <div class="stock-container">
    <h2>Stock actuel</h2>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Sous-type</th>
          <th>Quantité</th>
          <th>Seuil</th>
          <th>Dernier réappro.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in stock" :key="item.id" :class="stockClass(item)">
          <td>{{ item.type }}</td>
          <td>{{ item.subtype || '-' }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.threshold }}</td>
          <td>{{ formatDate(item.lastRestocked) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="isAdmin" class="admin-stock">
      <h3>Réapprovisionnement</h3>
      <form @submit.prevent="restock">
        <label>Type :</label>
        <select v-model="restockType" required>
          <option value="cafe">Café</option>
          <option value="the">Thé</option>
          <option value="nourriture">Nourriture</option>
        </select>
        <div v-if="restockType === 'nourriture'">
          <label>Sous-type :</label>
          <select v-model="restockSubtype" required>
            <option value="gateau">Gâteau</option>
            <option value="viennoiserie">Viennoiserie</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <label>Quantité à ajouter :</label>
        <input v-model.number="restockQuantity" type="number" min="1" required />
        <label>Commentaire :</label>
        <input v-model="restockReason" type="text" placeholder="Optionnel" />
        <button type="submit">Réapprovisionner</button>
      </form>
      <p v-if="restockError" class="error">{{ restockError }}</p>
      <p v-if="restockSuccess" class="success">Stock mis à jour !</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockView',
  data() {
    return {
      stock: [],
      error: '',
      restockType: 'cafe',
      restockSubtype: 'gateau',
      restockQuantity: 1,
      restockReason: '',
      restockError: '',
      restockSuccess: false
    }
  },
  computed: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.role === 'admin'
    }
  },
  methods: {
    async fetchStock() {
      this.error = ''
      try {
        const token = localStorage.getItem('token')
  const response = await fetch('/stock', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (!response.ok) {
          this.error = 'Erreur lors de la récupération du stock.'
          return
        }
        this.stock = await response.json()
      } catch (e) {
        this.error = 'Erreur réseau ou serveur.'
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },
    stockClass(item) {
      if (item.quantity <= 0) return 'stock-empty'
      if (item.quantity < item.threshold) return 'stock-low'
      return 'stock-ok'
    },
    async restock() {
      this.restockError = ''
      this.restockSuccess = false
      if (this.restockQuantity < 1) {
        this.restockError = 'Quantité invalide.'
        return
      }
      try {
        const token = localStorage.getItem('token')
  const response = await fetch('/stock/restock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            type: this.restockType,
            subtype: this.restockType === 'nourriture' ? this.restockSubtype : null,
            quantity: this.restockQuantity,
            reason: this.restockReason
          })
        })
        if (!response.ok) {
          this.restockError = 'Erreur lors du réapprovisionnement.'
          return
        }
        this.restockSuccess = true
        this.fetchStock()
        this.restockQuantity = 1
        this.restockReason = ''
      } catch (e) {
        this.restockError = 'Erreur réseau ou serveur.'
      }
    }
  },
  mounted() {
    this.fetchStock()
  }
}
</script>

<style scoped>
.stock-container { max-width: 700px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
th, td { border: 1px solid #eee; padding: 0.5rem; text-align: center; }
.stock-ok { background: #eafbe7; }
.stock-low { background: #fffbe6; }
.stock-empty { background: #fdeaea; }
.error { color: #e74c3c; margin-top: 1rem; }
.success { color: #27ae60; margin-top: 1rem; }
.admin-stock { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; }
</style>
