<template>
  <div class="range">
    <div class="selected-prices">
      <p>
        Min: <span class="bold">{{ pricesSelected.min }}</span>
      </p>
      <p>
        Max: <span class="bold">{{ pricesSelected.max }}</span>
      </p>
    </div>

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
        v-model="pricesSelected.min"
        @update:model-value="sliderMinHandler" />
      <input
        type="range"
        :min="prices?.min"
        :max="prices?.max"
        v-model="pricesSelected.max"
        @update:model-value="sliderMaxHandler" />
    </div>
    <div class="prices">
      <p>{{ prices?.min }}</p>
      <p>{{ prices?.max }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { IPrices } from '@/types/prices';
import type { ISelectedPrices } from '@/types/prices';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

interface IProps {
  prices: IPrices;
  pricesSelected: ISelectedPrices;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:pricesSelected', query: ISelectedPrices): void;
}
const emit = defineEmits<IEmits>();

const pricesSelected = useVModelWrapper(props, emit, 'pricesSelected');

const minGap = 1000;

const progressLeftStyle = computed(() => `${(pricesSelected.value.min / props.prices?.max) * 100}%`);
const progressRightStyle = computed(() => `${100 - (pricesSelected.value.max / props.prices?.max) * 100}%`);

const sliderMinHandler = () => {
  if (Number(pricesSelected.value.max) - Number(pricesSelected.value.min) <= minGap) {
    pricesSelected.value.min = Number(pricesSelected.value.max) - minGap;
  }
};

const sliderMaxHandler = () => {
  if (Number(pricesSelected.value.max) - Number(pricesSelected.value.min) <= minGap) {
    pricesSelected.value.max = Number(pricesSelected.value.min) + minGap;
  }
};
</script>

<style lang="scss" scoped>
.range {
  align-self: center;
}
.slider {
  position: relative;
  width: 150px;
  height: 5px;
  background: #b9b9bbe1;
  border-radius: 5px;

  & .progress {
    position: absolute;
    right: 25%;
    left: 25%;
    height: 5px;
    background: #187705;
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
      border-radius: 50%;
      -webkit-appearance: none;
      background: #187705;
      pointer-events: auto;
    }

    &::-moz-range-thumb {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background: #187705;
      pointer-events: auto;
    }
  }
}

.prices {
  display: flex;
  justify-content: space-between;
}

.bold {
  font-weight: bold;
}
</style>
