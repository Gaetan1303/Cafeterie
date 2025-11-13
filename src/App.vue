
<template>
  <nav style="display: flex; gap: 1rem; margin-bottom: 2rem;">
    <router-link to="/">Accueil</router-link>
    <router-link to="/auth" v-if="!isLoggedIn">Connexion / Inscription</router-link>
    <router-link to="/dashboard" v-if="isLoggedIn">Dashboard</router-link>
    <router-link to="/achat" v-if="isLoggedIn">Pointage achat</router-link>
    <router-link to="/stock" v-if="isAdmin">Stock</router-link>
    <router-link to="/historique" v-if="isLoggedIn">Historique</router-link>
    <router-link to="/profil" v-if="isLoggedIn">Profil</router-link>
    <a href="#" v-if="isLoggedIn" @click.prevent="logout">Déconnexion</a>
  </nav>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: this.getUser()
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.user && !!this.user.email
    },
    isAdmin() {
      return this.user && this.user.role === 'admin'
    }
  },
  methods: {
    getUser() {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}')
      } catch {
        return {}
      }
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.user = {}
      this.$router.push('/auth')
    }
  },
  mounted() {
    window.addEventListener('storage', () => {
      this.user = this.getUser()
    })
  }
}
</script>


