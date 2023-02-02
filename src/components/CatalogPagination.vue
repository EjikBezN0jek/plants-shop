<template>
  <div class="pagination">
    <button
      v-for="page in pagination.last"
      :key="page"
      @click="emit('changePage', page)"
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
.active {
  color: green;
  border: 4px solid green;
  border-radius: 2px;
  background: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
