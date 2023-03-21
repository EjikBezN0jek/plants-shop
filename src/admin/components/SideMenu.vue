<template>
  <div class="sidemenu">
    <router-link to="/"
      ><img
        alt="Vue logo"
        src="/images/logo.png"
        class="logo"
    /></router-link>
    <div
      v-for="item in menuItems"
      :key="item.label">
      <router-link
        :to="{ name: item.name }"
        class="menu-item">
        <i
          :class="item.icon"
          style="font-size: 1rem">
        </i>
        {{ item.label }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const menuItems = [
  { label: 'Home', icon: 'pi pi-fw pi-home', name: 'admin' },
  { label: 'Categories', icon: 'pi pi-fw pi-tag', name: 'adminCategories' },
  { label: 'Products', icon: 'pi pi-fw pi-shopping-bag', name: 'adminProducts' },
  { label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', name: 'adminOrders' },
  { label: 'Reviews', icon: 'pi pi-fw pi-star', name: 'adminReviews' },
];
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.logo {
  width: 40px;
  height: 40px;
}
.sidemenu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
  min-width: 200px;
  max-width: 300px;
  border: 2px solid $image-background-color;
  padding: 20px;
  height: 100%;
  position: fixed;
  align-items: flex-start;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $secondary-color;
  text-decoration: none;
  text-transform: uppercase;
}
</style>
