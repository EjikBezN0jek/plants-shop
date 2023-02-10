<template>
  <div class="range">
    <div class="slider">
      <div
        ref="progress"
        class="progress"
        :style="{ left: progressLeftStyle, right: progressRightStyle }"></div>
    </div>
    <div class="range-input">
      <input
        type="range"
        :min="prices?.min"
        :max="prices?.max"
        v-model.number="pricesSelected.min"
        @change="emit('update:modelValue', pricesSelected)"
        @update:model-value="sliderMinHandler" />

      <input
        type="range"
        :min="prices?.min"
        :max="prices?.max"
        v-model.number="pricesSelected.max"
        @change="emit('update:modelValue', pricesSelected)"
        @update:model-value="sliderMaxHandler" />
    </div>
    <div class="prices">
      <p>$ {{ pricesSelected.min }}</p>
      <p>$ {{ pricesSelected.max }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { IPrices } from '@/types/prices';

interface IProps {
  modelValue: IPrices;
  prices: IPrices;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:modelValue', query: IPrices): void;
}
const emit = defineEmits<IEmits>();

const pricesSelected = ref(props.modelValue);

const minGap = 1000;

const progressLeftStyle = computed(() => `${(pricesSelected.value.min / props.prices?.max) * 100}%`);
const progressRightStyle = computed(() => `${100 - (pricesSelected.value.max / props.prices?.max) * 100}%`);

const sliderMinHandler = () => {
  if (pricesSelected.value.max - pricesSelected.value.min <= minGap) {
    pricesSelected.value.min = pricesSelected.value.max - minGap;
  }
};

const sliderMaxHandler = () => {
  if (pricesSelected.value.max - pricesSelected.value.min <= minGap) {
    pricesSelected.value.max = pricesSelected.value.min + minGap;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
.range {
  width: 200px;
}
.slider {
  position: relative;
  width: 100%;
  height: 3px;
  background: $complementary-color;
  border-radius: 5px;

  & .progress {
    position: absolute;
    right: 25%;
    left: 25%;
    height: 3px;
    background: $primary-color;
    border-radius: 5px;
  }
}

.range-input {
  position: relative;

  & input {
    position: absolute;
    margin: 0;
    top: -5px;
    left: 0;
    height: 5px;
    width: 100%;
    -webkit-appearance: none;
    background: none;
    pointer-events: none;

    &::-webkit-slider-thumb {
      height: 15px;
      width: 15px;
      border: 1px solid white;
      border-radius: 50%;
      -webkit-appearance: none;
      background: $primary-color;
      pointer-events: auto;
    }

    &::-moz-range-thumb {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background: $primary-color;
      pointer-events: auto;
    }
  }
}

.prices {
  display: flex;
  justify-content: space-between;

  p {
    color: $secondary-color;
  }
}

.bold {
  font-weight: bold;
}
</style>
