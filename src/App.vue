<template>
  <TheHeader />

  <router-view />

  <TheFooter />
</template>

<script lang="ts" setup>
import { ref, provide, onMounted } from 'vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

import { UserKey } from '@/symbols';
import type { IUser } from '@/types/user';

const user = ref<IUser>();
provide(UserKey, user);

onMounted(() => {
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '') ?? {};
});
</script>

<style lang="scss"></style>
