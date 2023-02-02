<template>
  <div>
    <div
      class="products"
      v-if="products?.length">
      <div
        v-for="product in products"
        :key="product.id"
        class="product">
        <p>{{ product.name }}</p>
        <p>Rating: {{ product.rating }}</p>
        <p>{{ product.price }}$</p>
        <div class="product__colors">
          <p
            v-for="color in product.colors"
            :key="color">
            {{ color }}
          </p>
        </div>
      </div>
    </div>
    <h2 v-else>No products!</h2>
  </div>
</template>

<script lang="ts" setup>
import type { IProduct } from '@/types/product';

interface IProps {
  products?: IProduct[];
}

const props = defineProps<IProps>();
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.products {
  padding: 50px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 45px 0;
}
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 25%;
  &__colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}
</style>
