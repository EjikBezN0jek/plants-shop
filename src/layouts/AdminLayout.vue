<template>
  <div>
    <SideMenu />

    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          :is="Component"
          :key="route.name">
        </component>
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/admin/components/SideMenu.vue';
</script>

<style scoped lang="scss"></style>
