<template>
  <div>
    <div
      class="products"
      v-if="products?.length">
      <div
        v-for="product in products"
        :key="product.id"
        class="product">
        <img
          :src="`/images/products/${product.img}`"
          alt="product-image"
          class="image" />
        <h3 class="name">{{ product.name }}</h3>
        <p class="price">$ {{ product.price }}</p>
        <div class="product__colors">
          <div
            v-for="color in product.colors"
            :key="color"
            class="color"
            :class="color"></div>
        </div>
        <Rating
          :readonly="true"
          :cancel="false"
          :model-value="product.rating" />
      </div>
    </div>
    <h2 v-else>No products!</h2>
  </div>
</template>

<script lang="ts" setup>
import type { IProduct } from '@/types/product';

import Rating from 'primevue/rating';

interface IProps {
  products?: IProduct[];
}

const props = defineProps<IProps>();
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

p {
  margin: 0;
}
.products {
  padding: 50px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: calc(25% - 22.5px);
  min-height: 350px;
  border: 1px solid $complementary-color;
  border-radius: 5px;
  padding: 0 0 20px;
  cursor: pointer;

  &:hover {
    border: 1px solid $primary-color;
  }
  &__colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.name {
  margin: 0;
  height: 50px;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
}

.price {
  font-weight: bold;
  color: $primary-color;
}

.color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: orange;

  &.red {
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
</style>
