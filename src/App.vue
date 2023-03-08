<template>
  <TheHeader />

  <router-view />

  <TheFooter />
</template>

<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

import { UserKey, CartItemsQuantityKey } from '@/symbols';
import type { IUser } from '@/types/user';

const user = ref<IUser>();
provide(UserKey, user);

const cartItemsQuantity = ref(0);
provide(CartItemsQuantityKey, cartItemsQuantity);

onMounted(() => {
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
});
</script>

<style lang="scss"></style>
