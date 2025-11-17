
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
import { useUserStore } from './store/userStore';

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore();
    const logout = () => {
      userStore.logout();
      // Optionnel : router vers /auth
      window.location.href = '/auth';
    };
    return {
      userStore,
      logout
    };
  },
  computed: {
    isLoggedIn() {
      return this.userStore.isAuthenticated;
    },
    isAdmin() {
      return this.userStore.isAdmin;
    }
  }
}
</script>


