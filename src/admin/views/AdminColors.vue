<template>
  <div>
    <h1>Colors</h1>
    <div class="items">
      <div
        v-for="color in colors"
        :key="color.id"
        class="item-card">
        <div
          class="color"
          :class="color.name"
          :style="{ background: color.code }"></div>
        <strong>{{ color.name }}</strong>
        <p>{{ color.count }} items</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllColors, fetchAllProducts } from '@/api/catalog';

import type { IColor } from '@/types/color';

interface ICountableColor extends IColor {
  count: number;
}

const colors = ref<ICountableColor[]>();

onMounted(async () => {
  const rawColors = await fetchAllColors();

  colors.value = await Promise.all(
    rawColors.map(async (color: IColor) => {
      const count = (await fetchAllProducts({ colors_like: color.name })).data.length;
      return { ...color, count };
    })
  );
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.color {
  &.white {
    border: 1px solid $complementary-color;
  }
}
</style>
