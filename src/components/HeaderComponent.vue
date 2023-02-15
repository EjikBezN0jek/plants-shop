<template>
  <div class="header">
    <div class="menu">
      <SideMenu
        :menu-items="menuItems"
        :is-open-sidemenu="isOpenSidemenu"
        @toggle-menu="toggleSidemenu" />
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

    <MegaMenu
      :model="menuItems"
      class="big-menu" />
  </div>
</template>

<script lang="ts" setup>
import SideMenu from '@/components/SideMenu.vue';
import MegaMenu from 'primevue/megamenu';
import { ref } from 'vue';

const menuItems = ref([
  { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
  { label: 'Catalog', icon: 'pi pi-fw pi-shopping-bag', to: '/catalog' },
  { label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', to: '/cart' },
  { label: 'Log in', icon: 'pi pi-fw pi-user', to: '/login' },
]);

const isOpenSidemenu = ref(false);

const toggleSidemenu = () => {
  isOpenSidemenu.value ? (isOpenSidemenu.value = false) : (isOpenSidemenu.value = true);
  isOpenSidemenu.value ? document.body.classList.add('hidden') : document.body.classList.remove('hidden');
};
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.header {
  width: 100%;
}
.menu {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include sm {
    display: block;
    padding: 10px;
    .pi-bars,
    .pi-shopping-cart {
      display: none;
    }
  }
}

.logo {
  width: 40px;
  height: 40px;
}

.big-menu {
  display: none;

  @include sm {
    display: flex;
    background: none !important;
    justify-content: center;
    border: none !important;
    border-top: 1px solid $complementary-color !important;
    border-bottom: 1px solid $complementary-color !important;
  }
}
</style>
