<template>
  <div class="pagination">
    <button
      v-for="page in pagination.last"
      :key="page"
      @click="emit('changePage', page)"
      class="button"
      :class="{ active: isActivePage(page) }">
      {{ page }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { IPagination } from '@/types/';

interface IProps {
  pagination: IPagination;
}

interface IEmits {
  (e: 'changePage', page: number): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const isActivePage = (page: number) => page === props.pagination.current;
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.button {
  padding: 0 10px;
  font-size: 16px;
  background: none;
  color: $complementary-color;
  font-weight: 600;
  border: none;
}
.active {
  color: $primary-color;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
