<template>
  <div class="container">
    <div class="menu">
      <i
        class="pi pi-bars"
        style="font-size: 2.5rem"
        @click="toggleSidemenu" />
      <img
        alt="Vue logo"
        src="/images/logo.png"
        class="logo" />
      <i
        class="pi pi-shopping-cart"
        style="font-size: 2.5rem" />
    </div>

    <TabMenu
      :model="items"
      class="tab-menu" />
    <router-view />
  </div>
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

const isOpenSidemenu = ref(false);

const toggleSidemenu = () => {
  isOpenSidemenu.value ? (isOpenSidemenu.value = false) : (isOpenSidemenu.value = true);
  console.log(isOpenSidemenu.value);
};
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.menu {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include sm {
    display: block;
    & .pi-bars,
    & .pi-shopping-cart {
      display: none;
    }
  }
}

.logo {
  width: 40px;
  height: 40px;
}

.p-tabmenu-nav {
  justify-content: center;
}

.tab-menu {
  display: none;

  @include sm {
    display: block;
  }
}
</style>
