// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

//  1. Créer Pinia
const pinia = createPinia();

//  2. Créer l'app
const app = createApp(App);

//  3. Enregistrer Pinia (AVANT tout)
app.use(pinia);

//  4. Enregistrer le router
app.use(router);

//  5. Monter l'app
app.mount('#app');

//  6. Initialiser les stores APRÈS le mount
// Ne pas faire d'appel ici si App.vue gère déjà les stores