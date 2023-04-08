<template>
  <div class="swiper">
    <div class="swiper-wrapper">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :colors-list="colorsList"
        class="swiper-slide" />
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';

import type { IProduct } from '@/types/product';
import type { IColor } from '@/types/color';

interface IProps {
  products?: IProduct[];
  colorsList?: IColor[];
}

const props = defineProps<IProps>();
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '~swiper/swiper-bundle.min.css';

::v-deep(.swiper-button-next::after),
::v-deep(.swiper-button-prev::after) {
  color: $primary-color;
}

::v-deep(.swiper-pagination-bullet-active) {
  background-color: $primary-color;
}

::v-deep(.swiper-pagination) {
  position: relative;
  margin-top: 15px;
}

::v-deep(.swiper-button-disabled) {
  display: none;
}
</style>
