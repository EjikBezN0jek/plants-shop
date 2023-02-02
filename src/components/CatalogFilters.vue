<template>
  <div class="filters">
    <div class="categories">
      <h3>Categories</h3>
      <button
        @click="categorySelected = ''"
        :class="{ active: isActiveCategory() }">
        All
      </button>
      <button
        v-for="{ id, name, label } in categoriesList"
        :key="id"
        @click="categorySelected = name"
        :class="{ active: isActiveCategory(name) }">
        {{ label }}
      </button>
    </div>

    <div class="colors">
      <h3>Potter colors</h3>
      <div
        v-for="{ id, name, label } in colorsList"
        :key="id">
        <label>
          <input
            type="checkbox"
            :value="name"
            v-model="colorsSelected" />
          {{ label }}
        </label>
      </div>
    </div>

    <RangeSlider :prices="prices" />
  </div>
</template>

<script lang="ts" setup>
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import RangeSlider from '@/components/RangeSlider.vue';

interface IProps {
  categoriesList?: ICategory[];
  colorsList?: IColor[];
  colors: string[];
  category: string;
  prices?: IPrices;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:colors', query: IColor[]): void;
  (e: 'update:category', name: string): void;
}
const emit = defineEmits<IEmits>();

const colorsSelected = useVModelWrapper(props, emit, 'colors');
const categorySelected = useVModelWrapper(props, emit, 'category');

const isActiveCategory = (category = '') => {
  return category === props.category;
};
</script>

<style lang="scss" scoped>
.active {
  color: green;
  border: 4px solid green;
  border-radius: 2px;
  background: white;
}

.filters {
  display: flex;
  gap: 50px;
}
.categories {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.colors {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
