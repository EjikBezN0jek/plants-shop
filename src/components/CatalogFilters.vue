<template>
  <div class="filters">
    <div class="categories">
      <h3>Categories</h3>
      <button
        class="category"
        @click="categorySelected = ''"
        :class="{ active: isActiveCategory() }">
        All
      </button>
      <button
        v-for="{ id, name, label } in categoriesList"
        :key="id"
        class="category"
        :class="{ active: isActiveCategory(name) }"
        @click="categorySelected = name">
        {{ label }}
      </button>
    </div>

    <div class="colors">
      <h3>Potter colors</h3>
      <div
        v-for="{ id, name, label } in colorsList"
        :key="id"
        class="field-checkbox">
        <Checkbox
          v-model="colorsSelected"
          :value="name"
          :input-id="name"
          :aria-label="label" />
        <label :for="name">{{ label }}</label>
      </div>
    </div>

    <div class="prices">
      <h3>Price range</h3>
      <RangeSlider
        v-if="prices"
        :prices="prices"
        v-model="pricesSelected" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';

import Checkbox from 'primevue/checkbox';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import RangeSlider from '@/components/RangeSlider.vue';

interface IProps {
  categoriesList?: ICategory[];
  colorsList?: IColor[];
  colors: string[];
  category: string;
  prices?: IPrices;
  pricesSelected?: IPrices;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:colors', query: IColor[]): void;
  (e: 'update:category', name: string): void;
  (e: 'update:pricesSelected', query: IPrices): void;
}
const emit = defineEmits<IEmits>();

const colorsSelected = useVModelWrapper(props, emit, 'colors');
const categorySelected = useVModelWrapper(props, emit, 'category');
const pricesSelected = useVModelWrapper(props, emit, 'pricesSelected');

const isActiveCategory = (category = '') => {
  return category === props.category;
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.filters {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.category {
  position: relative;
  padding: 0 0 0 20px;
  color: $secondary-color;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: $secondary-color;
  }

  &:hover,
  &.active {
    color: $primary-color;

    &::before {
      background: $primary-color;
    }
  }
}

.categories,
.colors,
.prices {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
