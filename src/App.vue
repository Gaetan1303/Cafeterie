<template>
  <nav style="display: flex; gap: 1rem; margin-bottom: 2rem;">
    <router-link to="/">Accueil</router-link>
    <router-link to="/auth" v-if="!isLoggedIn">Connexion / Inscription</router-link>
    <router-link to="/dashboard" v-if="isAdmin">Dashboard</router-link>
    <router-link to="/achat" v-if="isLoggedIn">Pointage achat</router-link>
    <router-link to="/machines" v-if="isLoggedIn">Allumer</router-link>
    <router-link to="/stock" v-if="isAdmin">Stock</router-link>
    <router-link to="/historique" v-if="isLoggedIn">Historique</router-link>
    <router-link to="/profil" v-if="isLoggedIn">Profil</router-link>
    <a href="#" v-if="isLoggedIn" @click.prevent="logout">Déconnexion</a>
  </nav>
  <GlobalError />
  <GlobalToast />
  <GlobalLoader :visible="loading" />
  <router-view />
</template>

<script setup>
import { computed, ref } from 'vue';
import GlobalError from './components/GlobalError.vue';
import GlobalToast from './components/GlobalToast.vue';
import GlobalLoader from './components/GlobalLoader.vue';
import { useUserStore } from './store/userStore';
import { useLoaderStore } from './store/loaderStore';

//  Appel sécurisé avec gestion d'erreur
let userStore = null;
let loaderStore = null;

try {
  userStore = useUserStore();
  loaderStore = useLoaderStore();
} catch (e) {
  console.error('Erreur initialisation stores:', e);
}

// Computed avec fallback sécurisé
const isLoggedIn = computed(() => userStore?.isAuthenticated ?? false);
const isAdmin = computed(() => userStore?.isAdmin ?? false);
const loading = computed(() => loaderStore?.loading ?? false);

function logout() {
  if (userStore) {
    userStore.logout();
    window.location.href = '/';
  }
}
</script>

<style>
nav {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
  font-size: 1.15rem;
}
nav a, nav .router-link-active {
  color: #4B0082;
  text-decoration: none;
  font-weight: 500;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}
nav a.router-link-exact-active, nav .router-link-exact-active {
  background: #e6e6fa;
  color: #2d8cf0;
  text-decoration: underline;
}
nav a:hover {
  background: #f3f3ff;
  color: #2d8cf0;
}
</style>