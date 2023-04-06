<template>
  <div>
    <TheHeader />
    <router-view v-slot="{ Component, route }">
      <component
        :is="Component"
        :key="route.name"></component>
    </router-view>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<style scoped lang="scss"></style>
