<template>
  <TabMenu
    :model="menuItems"
    class="tab-menu" />
  <router-view />
</template>

<script lang="ts" setup>
import type { IMenuItem } from '@/types/menuItem';
import TabMenu from 'primevue/tabmenu';

interface IProps {
  menuItems: IMenuItem[];
}
const props = defineProps<IProps>();
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

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
