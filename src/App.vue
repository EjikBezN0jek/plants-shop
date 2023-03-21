<template>
  <router-view />
</template>

<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';

import { UserKey, CartItemsQuantityKey } from '@/symbols';
import type { IUser } from '@/types/user';
import router from './router';

const user = ref<IUser>();
provide(UserKey, user);

const cartItemsQuantity = ref(0);
provide(CartItemsQuantityKey, cartItemsQuantity);

onMounted(() => {
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  if (user.value?.email === 'admin@111.com') router.push('admin');
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
});
</script>

<style lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
</style>
