import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './store/userStore';
// Import statique pour éviter les problèmes de chargement dynamique du chunk AuthView
import AuthView from './views/AuthView.vue';

// Guards centralisés

const routes = [
  {
    path: '/achat',
    name: 'Achat',
    component: () => import('./views/PurchaseView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historique',
    name: 'Historique',
    component: () => import('./views/HistoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profil',
    name: 'Profil',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('./views/EventView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/machines',
    name: 'Machines',
    component: () => import('./views/MachineView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/purchases',
    name: 'Purchases',
    component: () => import('./views/PurchaseView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('./views/StockView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stock-history',
    name: 'StockHistory',
    component: () => import('./views/HistoryView.vue'), // ou StockHistoryView si tu en crées un
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/consommables',
    name: 'Consommables',
    component: () => import('./views/StockView.vue'), // à remplacer par ConsommableView si besoin
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});



router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  // Si le store n'est pas initialisé mais un token existe en localStorage, recharge l'utilisateur
  if (!userStore.token && localStorage.getItem('user')) {
    const data = JSON.parse(localStorage.getItem('user'));
    if (data.token) userStore.setToken(data.token);
    if (!userStore.user && data.token) {
      try {
        // On recharge le profil utilisateur depuis l'API
        const { getProfile } = await import('./utils/api');
        const user = await getProfile(data.token);
        userStore.setUser(user);
      } catch (e) {
        userStore.logout();
        return next('/auth');
      }
    }
  }
  // Auth required
  if (to.meta && to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next('/auth');
  }
  // Admin required
  if (to.meta && to.meta.requiresAdmin && !userStore.isAdmin) {
    return next('/');
  }
  next();
});


export default router;
