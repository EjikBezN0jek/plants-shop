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
  modelValue: ISorting;
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:modelValue', sorting: ISorting): void;
}
const emit = defineEmits<IEmits>();

const sorting = useVModelWrapper(props, emit);

const sortOptions = [
  {
    label: 'Price: low to high',
    target: 'price',
    order: 'asc',
  },
  {
    label: 'Price: high to low',
    target: 'price',
    order: 'desc',
  },
  {
    label: 'Rating: low to high',
    target: 'rating',
    order: 'asc',
  },
  {
    label: 'Rating: high to low',
    target: 'rating',
    order: 'desc',
  },
];
</script>

<style lang="scss" scoped>
.p-dropdown {
  width: 200px;
}
</style>
