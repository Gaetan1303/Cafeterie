<template>
  <div class="auth-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
  <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
  <input v-model="password" type="password" placeholder="Mot de passe" required autocomplete="current-password" />
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>Pas de compte ? <a href="#" @click.prevent="$emit('switchMode', 'register')">Inscription</a></p>
  </div>
</template>

<script>
import { apiFetch } from '../utils/api';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      this.error = ''
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.error = 'Email invalide.'
        return
      }
      if (!this.password || this.password.length < 4) {
        this.error = 'Mot de passe requis.'
        return
      }
      try {
        const user = await apiFetch('auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email: this.email,
            password: this.password
          }
        })
        this.$emit('login', user)
      } catch (e) {
        this.error = e.message || "Erreur réseau ou serveur."
      }
    }
  }
}
</script>
