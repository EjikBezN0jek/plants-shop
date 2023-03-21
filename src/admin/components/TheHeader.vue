<template>
  <div class="header">
    <div class="admin">
      <div class="avatar">
        <p>A</p>
      </div>
      <p>{{ user?.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const user = useInject(UserKey);
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px;

  @include sm {
    padding: 20px;
  }
}

.admin {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: $image-background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
