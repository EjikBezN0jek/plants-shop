<template>
  <img
    alt="Vue logo"
    src="@/assets/logo.png"
    class="logo" />
  <TabMenu :model="items" />
  <router-view />
</template>

<script lang="ts" setup>
import TabMenu from 'primevue/tabmenu';
import { ref } from 'vue';

const items = ref([
  { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
  { label: 'Catalog', icon: 'pi pi-fw pi-shopping-bag', to: '/catalog' },
  { label: 'Cart', icon: 'pi pi-fw pi-shopping-cart' },
  { label: 'Log in', icon: 'pi pi-fw pi-user' },
]);
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $secondary-color;
  font-size: 16px;
}

.logo {
  width: 40px;
  height: 40px;
}

.p-tabmenu-nav {
  justify-content: center;
}
</style>
