<template>
  <div>
    <h1>This is user page</h1>
    <p>My orders</p>

    <div
      v-for="order in orders"
      :key="order.id">
      {{ order }}
    </div>

    <Button
      class="p-button-lg"
      @click="quitFromAccount"
      >Quit</Button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import Button from 'primevue/button';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

import type { IOrder } from '@/types/order';

import { fetchUserOrders } from '@/api/auth';

const orders = ref<IOrder[]>();

const user = useInject(UserKey);

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push('/');
};

onMounted(async () => {
  if (user.value) orders.value = await fetchUserOrders(user.value);
});
</script>

<style scoped></style>
