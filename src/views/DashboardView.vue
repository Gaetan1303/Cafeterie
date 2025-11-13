²<template>
  <div class="dashboard-container">
    <h2>Dashboard</h2>
    <div class="dashboard-section">
      <h3>Mes derniers achats</h3>
      <ul>
        <li v-for="item in purchases" :key="item.id">
          {{ formatDate(item.timestamp) }} : {{ item.type }} <span v-if="item.subtype">({{ item.subtype }})</span> x{{ item.quantity }}
        </li>
      </ul>
      <p v-if="purchases.length === 0">Aucun achat récent.</p>
    </div>
    <div class="dashboard-section">
      <h3>Stock actuel</h3>
      <ul>
        <li v-for="item in stock" :key="item.id">
          {{ item.type }} <span v-if="item.subtype">({{ item.subtype }})</span> : {{ item.quantity }}
        </li>
      </ul>
      <p v-if="stock.length === 0">Aucun stock disponible.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      purchases: [],
      stock: []
    }
  },
  methods: {
    async fetchPurchases() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/purchases/me?limit=5', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (response.ok) {
          this.purchases = await response.json()
        }
      } catch {}
    },
    async fetchStock() {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/stock', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (response.ok) {
          this.stock = await response.json()
        }
      } catch {}
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleString()
    }
  },
  mounted() {
    this.fetchPurchases()
    this.fetchStock()
  }
}
</script>

<style scoped>
.dashboard-container { max-width: 700px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
.dashboard-section { margin-bottom: 2rem; }
ul { padding-left: 1.2rem; }
</style>
