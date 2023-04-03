<template>
  <div>
    <h1>This is order {{ order?.id }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { IOrder } from '@/types/order';

import { fetchOrderById } from '../api/admin';

const route = useRoute();

const order = ref<IOrder>();

onMounted(async () => {
  order.value = await fetchOrderById(+route.params.id);
});
</script>

<style scoped lang="scss"></style>
