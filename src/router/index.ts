import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../layouts/BasicLayout.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
      },
      {
        path: '/catalog/:category?',
        name: 'catalog',
        component: () => import('@/views/CatalogPage.vue'),
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
        path: '/wishlist',
        name: 'wishlist',
        component: () => import('@/views/WishlistPage.vue'),
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/UserPage.vue'),
      },
      {
        path: '/checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import(/* webpackChunkName: "admin" */ '../layouts/AdminLayout.vue'),
    children: [
      {
        path: '/admin',
        name: 'dashboard',
        component: () => import('@/admin/views/AdminDashboard.vue'),
      },
      {
        path: 'products',
        name: 'adminProducts',
        component: () => import('@/admin/views/AdminProducts.vue'),
      },
      {
        path: 'categories',
        name: 'adminCategories',
        component: () => import('@/admin/views/AdminCategories.vue'),
      },
      {
        path: 'orders',
        name: 'adminOrders',
        component: () => import(/* webpackChunkName: "adminOrders" */ '@/admin/views/AdminOrders.vue'),
      },
      {
        path: 'order/:id?',
        name: 'order',
        component: () => import(/* webpackChunkName: "order" */ '@/admin/views/AdminOrderInfo.vue'),
      },
      {
        path: 'reviews',
        name: 'adminReviews',
        component: () => import(/* webpackChunkName: "adminReviews" */ '@/admin/views/AdminReviews.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
