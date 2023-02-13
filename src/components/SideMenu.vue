<template>
  <div
    class="sidemenu"
    :class="{ open: isOpenSidemenu }">
    <div
      class="sidemenu-overlay"
      @click="$emit('toggleMenu')" />
    <div class="sidemenu-content">
      <i
        class="pi pi-times"
        style="font-size: 1.5rem"
        @click="$emit('toggleMenu')" />
      <MegaMenu
        :model="menuItems"
        orientation="vertical"
        class="my-megamenu"
        @click="$emit('toggleMenu')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MegaMenu from 'primevue/megamenu';
import type { IMenuItem } from '@/types/menuItem';

interface IProps {
  menuItems: IMenuItem[];
  isOpenSidemenu: boolean;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'toggleMenu'): void;
}
const emit = defineEmits<IEmits>();
</script>

<style lang="scss">
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
  right: 101%;
  width: 75%;
  height: 100%;
  display: flex;
  transition: all 0.5s;
}

.pi-times {
  position: absolute;
  top: 10px;
  right: 10px;
}

.my-megamenu {
  font-size: 24px !important;
  padding: 2rem 0 !important;
  border-radius: 0 !important;
  width: 100% !important;
  border: none !important;
}
</style>
