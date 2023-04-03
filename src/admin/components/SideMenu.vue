<template>
  <div class="sidemenu">
    <div class="menu-list">
      <img
        alt="Vue logo"
        src="/images/logo.png"
        class="logo" />
      <router-link
        v-for="item in menuItems"
        :key="item.label"
        class="menu-item"
        :class="{ active: isActiveMenuItem(item.name) }"
        :to="{ name: item.name }">
        <i
          :class="item.icon"
          style="font-size: 1rem">
        </i>
        {{ item.label }}
      </router-link>
    </div>

    <div class="admin-wrapper">
      <div class="admin">
        <div class="avatar">
          <p>A</p>
        </div>
        <p>{{ user?.email }}</p>
      </div>
      <button
        class="quit-btn"
        @click="quitFromAccount">
        <i
          class="pi pi-sign-out"
          style="font-size: 1rem"></i>
        QUIT
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import router from '@/router';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const user = useInject(UserKey);

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', name: 'dashboard' },
  { label: 'Categories', icon: 'pi pi-fw pi-tag', name: 'adminCategories' },
  { label: 'Products', icon: 'pi pi-fw pi-shopping-bag', name: 'adminProducts' },
  { label: 'Orders', icon: 'pi pi-fw pi-shopping-cart', name: 'adminOrders' },
  { label: 'Reviews', icon: 'pi pi-fw pi-star', name: 'adminReviews' },
  { label: 'Go to shop', icon: 'pi pi-fw pi-home', name: 'home' },
];

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push({ name: 'home' });
};

const isActiveMenuItem = (name = '') => {
  return name === menuItemFromUrl.value;
};

const route = useRoute();
const menuItemFromUrl = ref();

onBeforeRouteUpdate(async to => {
  menuItemFromUrl.value = to.name;
});

onMounted(() => {
  menuItemFromUrl.value = route.name;
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.admin-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.menu-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.quit-btn {
  background: none;
  border: none;
  color: white;
  border: none;
  display: flex;
  gap: 10px;
  padding: 10px;
  width: 100%;
  align-self: flex-end;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background: $primary-color-accent;
  }

  &:focus {
    box-shadow: none;
  }
}

.admin {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.avatar {
  width: 40px;
  height: 40px;
  background: $image-background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.logo {
  width: 40px;
  height: 40px;
  align-self: center;
  margin-bottom: 15px;
}
.sidemenu {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 250px;
  padding: 20px;
  height: 100%;
  position: fixed;
  align-items: flex-start;
  z-index: 11111;
  justify-content: space-between;
  background: $primary-color;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  width: 100%;
  border-bottom: 2px solid transparent;
  color: white;
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    background: $primary-color-accent;
  }

  &.active {
    border-bottom: 2px solid white;
  }
}
</style>
