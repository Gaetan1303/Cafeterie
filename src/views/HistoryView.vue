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
      <h3>Vue globale (admin)</h3>
      <button @click="fetchAllHistory">Voir tout l'historique</button>
      <table v-if="allHistory.length">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Date</th>
            <th>Type</th>
            <th>Sous-type</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allHistory" :key="item.id">
            <td>{{ item.userEmail }}</td>
            <td>{{ formatDate(item.timestamp) }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.subtype || '-' }}</td>
            <td>{{ item.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView',
  data() {
    return {
      history: [],
      allHistory: [],
      filterType: '',
      filterDate: '',
      error: ''
    }
  },
  computed: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return user.role === 'admin'
    }
  },
  methods: {
    async fetchHistory() {
      this.error = ''
      try {
        const token = localStorage.getItem('token')
  let url = '/purchases/me?'
        if (this.filterType) url += `type=${this.filterType}&`
        if (this.filterDate) url += `date=${this.filterDate}`
        const response = await fetch(url, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (!response.ok) {
          this.error = 'Erreur lors de la récupération de l\'historique.'
          return
        }
        this.history = await response.json()
      } catch (e) {
        this.error = 'Erreur réseau ou serveur.'
      }
    },
    async fetchAllHistory() {
      this.error = ''
      try {
        const token = localStorage.getItem('token')
  const response = await fetch('/purchases', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        if (!response.ok) {
          this.error = 'Erreur lors de la récupération de l\'historique global.'
          return
        }
        this.allHistory = await response.json()
      } catch (e) {
        this.error = 'Erreur réseau ou serveur.'
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleString()
    }
  },
  mounted() {
    this.fetchHistory()
  }
}
</script>

<style scoped>
.history-container { max-width: 800px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
th, td { border: 1px solid #eee; padding: 0.5rem; text-align: center; }
.filters { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
.error { color: #e74c3c; margin-top: 1rem; }
.admin-history { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; }
</style>
