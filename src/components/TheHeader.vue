<template>
  <div class="header">
    <div class="mobile-menu">
      <SideMenu
        :menu-items="menuItems"
        :menu-item-selected="menuItemSelected"
        :is-open-sidemenu="isOpenSidemenu"
        @toggle-menu="toggleSidemenu"
        @toggle-auth-modal="toggleAuthModal" />
      <i
        class="pi pi-bars"
        style="font-size: 2.5rem"
        @click="toggleSidemenu" />

      <router-link to="/"
        ><img
          alt="Vue logo"
          src="/images/logo.png"
          class="logo"
      /></router-link>
      <CartWidget />
    </div>

    <MenuList
      :menu-items="menuItems"
      :menu-item-selected="menuItemSelected"
      @toggle-auth-modal="toggleAuthModal"
      class="big-menu" />

    <AuthModal
      v-if="isShowAuth"
      @hide="toggleAuthModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SideMenu from '@/components/SideMenu.vue';
import AuthModal from '@/components/AuthModal.vue';
import MenuList from '@/components/MenuList.vue';
import CartWidget from '@/components/CartWidget.vue';

const route = useRoute();
const menuItemSelected = ref('');

const isShowAuth = ref(false);
const toggleAuthModal = () => (isShowAuth.value = !isShowAuth.value);

const menuItems = [
  { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
  { label: 'Catalog', icon: 'pi pi-fw pi-shopping-bag', to: '/catalog' },
  { label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', to: '/cart' },
  { label: 'Wishlist', icon: 'pi pi-fw pi-heart', to: '/wishlist' },
];

const isOpenSidemenu = ref(false);
const toggleSidemenu = () => {
  isOpenSidemenu.value ? (isOpenSidemenu.value = false) : (isOpenSidemenu.value = true);
  isOpenSidemenu.value ? document.body.classList.add('hidden') : document.body.classList.remove('hidden');
};

watch(route, newValue => {
  menuItemSelected.value = newValue.name ?? '';
});
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.header {
  width: 100%;
}

.mobile-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;

  @include sm {
    display: block;
    padding: 10px;

    .pi-bars {
      display: none;
    }
  }
}

.big-menu {
  display: none !important;

  @include sm {
    display: flex !important;
  }
}

.logo {
  width: 40px;
  height: 40px;
}
</style>
