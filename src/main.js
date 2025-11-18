import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');

// Initialisation des stores APRES le mount
import { useUserStore } from './store/userStore';
import { useErrorStore } from './store/errorStore';

try {
	const userStore = useUserStore();
	// Persistance manuelle si nécessaire
	const saved = localStorage.getItem('user');
	if (saved) {
		const data = JSON.parse(saved);
		if (data.token) userStore.setToken(data.token);
		if (data.user) userStore.setUser(data.user);
	}
	userStore.$subscribe((mutation, state) => {
		localStorage.setItem('user', JSON.stringify({
			token: state.token,
			user: state.user
		}));
	});
	useErrorStore();
} catch (e) {
	console.error('Erreur initialisation stores:', e);
}
