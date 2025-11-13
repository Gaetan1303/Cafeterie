
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/profil',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
  },
  {
    path: '/historique',
    name: 'History',
    component: () => import('./views/HistoryView.vue'),
  },
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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
  },
  {
    path: '/achat',
    name: 'Purchase',
    component: () => import('./views/PurchaseView.vue'),
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('./views/StockView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
