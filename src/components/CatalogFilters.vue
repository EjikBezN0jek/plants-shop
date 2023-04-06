<template>
  <div
    class="filters-toggler"
    @click="toggleFilters">
    <h3>Filters</h3>
    <i
      class="pi pi-angle-down"
      style="font-size: 1.5rem"
      :class="{ ['pi-angle-up']: isOpenFilters }" />
  </div>
  <div
    class="filters"
    :class="{ open: isOpenFilters }">
    <div class="wrapper">
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

        <div class="colors-list">
          <div
            v-for="{ id, name, code } in colorsList"
            :key="id">
            <Checkbox
              v-model="colorsSelected"
              :value="name"
              :input-id="name"
              :aria-label="name"
              class="color"
              :class="name"
              :style="{ background: code }" />
          </div>
        </div>
      </div>

      <div class="badges-list">
        <h3>Badges</h3>
        <div
          v-for="{ id, name, label } in badgesList"
          :key="id"
          class="field-checkbox">
          <Checkbox
            v-model="badgesSelected"
            :value="name"
            :input-id="name"
            :aria-label="label" />
          <label :for="name">{{ label }}</label>
        </div>
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
import { ref } from 'vue';

import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';
import type { IBadge } from '@/types/badge';

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
  badges: string[];
  badgesList?: IBadge[];
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:colors', query: IColor[]): void;
  (e: 'update:category', name: string): void;
  (e: 'update:pricesSelected', query: IPrices): void;
  (e: 'update:badges', query: IBadge[]): void;
}
const emit = defineEmits<IEmits>();

const colorsSelected = useVModelWrapper(props, emit, 'colors');
const categorySelected = useVModelWrapper(props, emit, 'category');
const pricesSelected = useVModelWrapper(props, emit, 'pricesSelected');
const badgesSelected = useVModelWrapper(props, emit, 'badges');

const isActiveCategory = (category = '') => {
  return category === props.category;
};

const isOpenFilters = ref(false);

const toggleFilters = () => {
  isOpenFilters.value ? (isOpenFilters.value = false) : (isOpenFilters.value = true);
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

::v-deep(.color.p-checkbox .p-checkbox-box) {
  border: none;
  background: none;
  align-self: center;
  margin: 0 auto;
  cursor: pointer;
}

::v-deep(.color.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus) {
  box-shadow: none;
  border-color: transparent;
}

::v-deep(.color.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
  border-color: transparent;
  background: none;
}

::v-deep(.color.p-checkbox .p-checkbox-box .p-checkbox-icon) {
  color: $primary-color;
  font-size: 18px;
  font-weight: bold;
}

::v-deep(.p-checkbox .p-component .color) {
  & .red {
    background: red;
  }
  &.white {
    background: white;
    border: 1px solid $complementary-color;
  }
  &.black {
    background: black;
  }
  &.gray {
    background: gray;
  }
}

.filters-toggler {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;

  @include sm {
    display: none;
  }
}
.filters {
  display: none;
  flex-direction: column;
  gap: 50px;
  border: 1px solid $complementary-color;
  border-radius: 5px;
  padding: 10px;

  @include sm {
    border: none;
    padding: 0;
    gap: 50px;
    display: flex;
    flex-direction: column;
  }

  &.open {
    display: flex;
  }
}

.wrapper {
  display: flex;
  justify-content: space-around;

  @include sm {
    flex-direction: column;
    gap: 50px;
  }
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
.prices,
.badges-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.colors-list {
  display: flex;
  gap: 10px;
}

.prices {
  align-self: center;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
