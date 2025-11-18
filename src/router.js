// src/router.js
import { createRouter, createWebHistory } from 'vue-router';

//  NE PAS importer le store ici au niveau global !!
// import { useUserStore } from './store/userStore'; 


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
  //  Importer dynamiquement pour éviter les erreurs de contexte
  const { useUserStore } = await import('./store/userStore');
  
  let userStore;
  try {
    userStore = useUserStore();
  } catch (e) {
    console.error('Erreur store dans router guard:', e);
    return next();
  }

  // Recharger le profil si nécessaire
  if (!userStore.token && localStorage.getItem('user')) {
    try {
      const data = JSON.parse(localStorage.getItem('user'));
      if (data.token) {
        userStore.setToken(data.token);
        if (!userStore.user && data.user) {
          userStore.setUser(data.user);
        }
      }
    } catch (e) {
      console.error('Erreur reload user:', e);
    }
  }

  // Guards d'authentification
  if (to.meta?.requiresAuth && !userStore.isAuthenticated) {
    return next('/auth');
  }
  if (to.meta?.requiresAdmin && !userStore.isAdmin) {
    return next('/');
  }
  
  next();
});


export default router;
