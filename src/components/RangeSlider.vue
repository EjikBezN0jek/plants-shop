<template>
  <div class="range">
    <div class="selected-prices">
      <!-- <p>Min {{ sliderMin.value.value }}</p> -->
      <!-- <p>Max {{ sliderMax.value }}</p> -->
    </div>

    <div class="slider">
      <div class="progress"></div>
    </div>
    <div class="range-input">
      <input
        ref="sliderMin"
        type="range"
        class="range-value range-min"
        min="25"
        max="10000"
        value="4500"
        @input="slideMin" />
      <input
        ref="sliderMax"
        type="range"
        class="range-value range-max"
        min="25"
        max="10000"
        value="7500"
        @input="slideMax" />
    </div>
    <div class="prices">
      <p>{{ prices?.min }}</p>
      <p>{{ prices?.max }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { IPrices } from '@/types/prices';
interface IProps {
  prices: IPrices;
}
const props = defineProps<IProps>();

const sliderMin = ref();
const sliderMax = ref();
const minGap = 1000;
// const sliderMaxValue = sliderMin.value.max;

const slideMin = () => {
  console.log(sliderMin.value.value);

  if (parseInt(sliderMax.value.value) - parseInt(sliderMin.value.value) <= minGap) {
    sliderMin.value.value = parseInt(sliderMax.value.value) - minGap;
  }
};

const slideMax = () => {
  console.log(sliderMax.value.value);

  if (parseInt(sliderMax.value.value) - parseInt(sliderMin.value.value) <= minGap) {
    sliderMax.value.value = parseInt(sliderMin.value.value) + minGap;
  }
};
</script>

<style lang="scss" scoped>
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
    // background: #187705;
    background: #343479e1;
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
</style>
