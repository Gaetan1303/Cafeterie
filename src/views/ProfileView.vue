<template>
  <div class="profile-container">
    <h2>Mon profil</h2>
    <form @submit.prevent="updateProfile">
      <label>Prénom :</label>
  <input v-model="firstName" type="text" required pattern="^[\wÀ-ÿ' -]{2,30}$" />
  <label>Nom :</label>
  <input v-model="lastName" type="text" required pattern="^[\wÀ-ÿ' -]{2,30}$" />
      <label>Email :</label>
      <input v-model="email" type="email" required disabled />
      <button type="submit">Mettre à jour</button>
    </form>
    <p v-if="success" class="success">Profil mis à jour !</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { apiFetch, API_BASE_URL } from '@/utils/api';

export default {
  name: 'ProfileView',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      error: '',
      success: false
    }
  },
  methods: {
    async fetchProfile() {
      this.error = ''
      try {
        const token = localStorage.getItem('token')
        const user = await apiFetch('profile/me', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        })
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
      } catch (e) {
        this.error = 'Erreur lors de la récupération du profil.'
      }
    },
    async updateProfile() {
      this.error = ''
      this.success = false
      const regex = /^[\wÀ-ÿ' -]{2,30}$/
      if (!regex.test(this.firstName) || !regex.test(this.lastName)) {
        this.error = 'Nom ou prénom invalide.'
        return
      }
      try {
        const token = localStorage.getItem('token')
        await apiFetch('profile/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName
          })
        })
        this.success = true
      } catch (e) {
        this.error = 'Erreur lors de la mise à jour.'
      }
    }
  },
  mounted() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.profile-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
label { display: block; margin-top: 1rem; }
input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; }
button { width: 100%; padding: 0.7rem; background: #2d8cf0; color: #fff; border: none; border-radius: 4px; }
.success { color: #27ae60; margin-top: 1rem; }
.error { color: #e74c3c; margin-top: 1rem; }
</style>
