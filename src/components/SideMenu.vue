<template>
  <div
    class="sidemenu"
    :class="{ open: isOpenSidemenu }">
    <div
      class="sidemenu-overlay"
      @click="emit('toggleMenu')" />
    <div class="sidemenu-content">
      <i
        class="pi pi-times"
        style="font-size: 1.5rem"
        @click="emit('toggleMenu')" />

      <MenuList
        :menu-item-selected="menuItemSelected"
        :menu-items="menuItems"
        @toggle-auth-modal="openAuthModal"
        @toggle-menu="emit('toggleMenu')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MenuList from '@/components/MenuList.vue';

import type { IMenuItem } from '@/types/menuItem';

interface IProps {
  menuItems: IMenuItem[];
  menuItemSelected: string;
  isOpenSidemenu: boolean;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'toggleMenu'): void;
  (e: 'toggleAuthModal'): void;
}
const emit = defineEmits<IEmits>();

const openAuthModal = () => {
  emit('toggleMenu'), emit('toggleAuthModal');
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.sidemenu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  visibility: hidden;
  opacity: 1;
  overflow: hidden;

  &.open {
    visibility: visible;

    .sidemenu-overlay {
      opacity: 1;
    }

    .sidemenu-content {
      transform: translateX(100%);
    }
  }
}

.sidemenu-overlay {
  opacity: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  transition: all 0.5s;
}

.sidemenu-content {
  position: absolute;
  top: 0;
  right: 100%;
  width: 75%;
  height: 100%;
  display: flex;
  transition: all 0.5s;
  background: white;
}

.pi-times {
  position: absolute;
  top: 10px;
  right: 10px;
}

.menu {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  border-bottom: 1px solid $complementary-color;
  width: 100%;
}
</style>
