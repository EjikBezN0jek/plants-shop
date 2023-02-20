<template>
  <div>
    <h1 class="title">Wishlist</h1>
    <ProductList :products="wishlistItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductList from '@/components/ProductList.vue';

const wishlistItems = ref([]);

onMounted(async () => {
  wishlistItems.value = JSON.parse(localStorage.getItem('wishlist')) || [];
});
</script>

<style lang="scss" scoped></style>
