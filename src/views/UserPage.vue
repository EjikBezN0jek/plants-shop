<template>
  <div>
    <h1>This is user page</h1>
    <p>My orders</p>

    <Button
      class="p-button-lg"
      @click="quitFromAccount"
      >Quit</Button
    >
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';
import router from '@/router';

const user = useInject(UserKey);

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push('/');
};
</script>

<style scoped></style>
