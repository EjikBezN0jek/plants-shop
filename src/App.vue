<template>
  <HeaderComponent />
  <div class="container">
    <router-view />
  </div>
  <FooterComponent />
</template>

<script lang="ts" setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
</script>

<style lang="scss"></style>
