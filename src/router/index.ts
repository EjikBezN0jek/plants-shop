import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/catalog/:category?',
    name: 'catalog',
    component: () => import('@/views/CatalogProducts.vue'),
  },
  {
    path: '/product/:name?/:id?',
    name: 'product',
    component: () => import('@/views/ProductPage.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LogIn.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
