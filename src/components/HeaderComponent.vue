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
      <router-link
        to="/cart"
        class="cart-link">
        <div class="notice">{{ cartItemsQuantity }}</div>
        <i
          class="pi pi-shopping-cart"
          style="font-size: 2.5rem"></i>
      </router-link>
    </div>

    <MegaMenu
      :model="menuItems"
      class="big-menu" />
  </div>
</template>

<script lang="ts" setup>
import SideMenu from '@/components/SideMenu.vue';
import MegaMenu from 'primevue/megamenu';
import { ref, onMounted } from 'vue';

const menuItems = ref([
  { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
  { label: 'Catalog', icon: 'pi pi-fw pi-shopping-bag', to: '/catalog' },
  { label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', to: '/cart' },
  { label: 'Wishlist', icon: 'pi pi-fw pi-heart', to: '/wishlist' },
  { label: 'Log in', icon: 'pi pi-fw pi-user', to: '/login' },
]);

const isOpenSidemenu = ref(false);

const toggleSidemenu = () => {
  isOpenSidemenu.value ? (isOpenSidemenu.value = false) : (isOpenSidemenu.value = true);
  isOpenSidemenu.value ? document.body.classList.add('hidden') : document.body.classList.remove('hidden');
};

const cartItemsQuantity = ref(0);
const getCartItemsQuantity = () => {
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
};

onMounted(async () => {
  getCartItemsQuantity();
});
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

.cart-link {
  color: $secondary-color;
  position: relative;
  @include sm {
    display: none;
  }
}

.notice {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(30%, -30%);
  width: 20px;
  height: 20px;
  background: $primary-color;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 111;
}
</style>
