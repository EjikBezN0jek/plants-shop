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
.button {
  padding: 0.5rem;
  border-radius: 2px;
  background: white;
  color: #6c757d;
  font-weight: 600;
  border: 1px solid #ced4da;
}
.active {
  color: #4caf50;
  border: 1px solid #4caf50;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
