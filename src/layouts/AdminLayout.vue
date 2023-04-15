<template>
  <div>
    <SideMenu />

    <router-view v-slot="{ Component, route }">
      <component
        :is="Component"
        :key="route.name"
        class="content">
      </component>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/admin/components/SideMenu.vue';
</script>

<style scoped lang="scss">
.content {
  padding: 20px;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}
</style>
