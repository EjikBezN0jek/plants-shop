<template>
  <div class="menu">
    <div
      v-for="item in menuItems"
      :key="item.label"
      class="item-wrapper">
      <router-link
        :to="item.to"
        class="menu-item"
        :class="{ active: isActiveItem(item.label) }"
        @click="emit('toggleMenu')">
        <i
          :class="item.icon"
          style="font-size: 1rem"></i>
        {{ item.label }}
      </router-link>
    </div>

    <router-link
      v-if="user?.name && !isAdmin(user.email)"
      :to="{ name: 'user' }"
      class="menu-item"
      :class="{ active: isActiveItem('user') }"
      @click="emit('toggleMenu')">
      <i
        class="pi pi-fw pi-user"
        style="font-size: 1rem"></i
      >{{ user.name }}</router-link
    >
    <router-link
      v-else-if="isAdmin(user?.email)"
      :to="{ name: 'dashboard' }"
      class="menu-item btn">
      <i
        class="pi pi-fw pi-wrench"
        style="font-size: 1rem"></i>
      Go to admin
    </router-link>
    <button
      v-else
      @click="emit('toggleAuthModal')"
      class="menu-item btn">
      <i
        class="pi pi-fw pi-user"
        style="font-size: 1rem"></i>
      Log in
    </button>
  </div>
</template>

<script setup lang="ts">
import type { IMenuItem } from '@/types/menuItem';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const user = useInject(UserKey);

interface IProps {
  menuItems?: IMenuItem[];
  menuItemSelected: string;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'toggleAuthModal'): void;
  (e: 'toggleMenu'): void;
}
const emit = defineEmits<IEmits>();

const isActiveItem = (item = '') => {
  return item.toLowerCase() === props.menuItemSelected;
};

const isAdmin = (email = '') => {
  return email === 'admin@111.com';
};
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.menu {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-bottom: 1px solid $complementary-color;

  @include sm {
    gap: 5px;
  }

  @include md {
    gap: 15px;
  }
}

.item-wrapper {
  width: 100%;

  @include sm {
    width: auto;
  }
}

.menu-item {
  color: $secondary-color;
  text-decoration: none;
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 10px 20px;

  @include sm {
    gap: 5px;
  }

  @include md {
    gap: 15px;
  }

  &:hover {
    background: $image-background-color;
    border-radius: 3px;
  }

  &.active {
    background: none;
    border-radius: 0;
    border-bottom: 2px solid $primary-color;
  }

  &.btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    text-align: left;
    flex-shrink: 0;

    &:hover {
      background: $image-background-color;
      border-radius: 3px;
    }
  }
}
</style>
