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

    <TabMenu :model="menuItems" />
  </div>
</template>

<script lang="ts" setup>
import SideMenu from '@/components/SideMenu.vue';
import TabMenu from 'primevue/tabmenu';

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

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.header {
  padding: 0 10px;

  @include md {
    padding: 0 20px;
  }

  @include xxl {
    padding: 0 75px;
  }
}
.menu {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include sm {
    display: block;
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

::v-deep(.p-tabmenu) {
  display: none;

  @include sm {
    display: block;
  }
}

::v-deep(.p-tabmenu-nav) {
  justify-content: center;
}
</style>
