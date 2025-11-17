

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useUserStore } from './store/userStore';
import { useErrorStore } from './store/errorStore';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
// Activer la persistance du userStore
const userStore = useUserStore();
userStore.persist && userStore.persist();
// Initialiser le errorStore pour la réactivité globale
useErrorStore();
app.mount('#app');
