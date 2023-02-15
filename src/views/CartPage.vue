<template>
  <div>
    <h1>This is cart!</h1>
    {{ cartItems }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const cartItems = ref([]);
</script>

<style lang="scss" scoped></style>
