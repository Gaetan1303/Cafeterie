
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
    <GlobalError />
    <GlobalToast />
    <GlobalLoader :visible="loaderStore.loading" />
    <router-view />
</template>


<script>
import GlobalError from './components/GlobalError.vue';
import GlobalToast from './components/GlobalToast.vue';
import GlobalLoader from './components/GlobalLoader.vue';
import { useUserStore } from './store/userStore';
import { useLoaderStore } from './store/loaderStore';

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore();
    const loaderStore = useLoaderStore();
    const logout = () => {
      userStore.logout();
      window.location.href = '/auth';
    };
    return {
      userStore,
      loaderStore,
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

<style>
.global-loader {
  position: fixed;
  z-index: 9998;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center;
}
.spinner {
  width: 60px; height: 60px;
  border: 7px solid #eee;
  border-top: 7px solid #2d8cf0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>


