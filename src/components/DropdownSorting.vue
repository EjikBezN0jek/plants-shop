<template>
  <div>
    <Dropdown
      v-model="sorting"
      :options="sortOptions"
      option-label="label"
      placeholder="sort by" />
  </div>
</template>

<script lang="ts" setup>
import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import Dropdown from 'primevue/dropdown';

import type { ISorting } from '@/types/sorting';

interface IProps {
  sorting: ISorting;
  sortOptions?: ISorting[];
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:sorting', query: ISorting): void;
}
const emit = defineEmits<IEmits>();

const sorting = useVModelWrapper(props, emit, 'sorting');
</script>

<style lang="scss" scoped>
::v-deep(.p-dropdown) {
  width: 200px;
}
</style>
