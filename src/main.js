

import { useUserStore } from './store/userStore';
import { useErrorStore } from './store/errorStore';


const app = createApp(App);
app.use(router);
app.use(pinia);
// Activer la persistance du userStore
const userStore = useUserStore();
userStore.persist();
// Initialiser le errorStore pour la réactivité globale
useErrorStore();
app.mount('#app');
