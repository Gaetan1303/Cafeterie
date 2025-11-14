

import { createRouter, createWebHistory } from 'vue-router';

// Guards centralisés (à compléter selon besoins)
// Exemple : import { requireAuth, requireAdmin } from './guards';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/HomeView.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./views/AuthView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('./views/HistoryView.vue'), // ou EventView si tu en crées un
    // meta: { requiresAuth: true }
  },
  {
    path: '/machines',
    name: 'Machines',
    component: () => import('./views/DashboardView.vue'), // à remplacer par MachineView si besoin
    // meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/purchases',
    name: 'Purchases',
    component: () => import('./views/PurchaseView.vue'),
    // meta: { requiresAuth: true }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('./views/StockView.vue'),
    // meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/stock-history',
    name: 'StockHistory',
    component: () => import('./views/HistoryView.vue'), // ou StockHistoryView si tu en crées un
    // meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/consommables',
    name: 'Consommables',
    component: () => import('./views/StockView.vue'), // à remplacer par ConsommableView si besoin
    // meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
    // meta: { requiresAuth: true, requiresAdmin: true }
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Exemple de global guard (à compléter)
// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !isLoggedIn()) {
//     return next('/auth');
//   }
//   if (to.meta.requiresAdmin && !isAdmin()) {
//     return next('/');
//   }
//   next();
// });


export default router;
