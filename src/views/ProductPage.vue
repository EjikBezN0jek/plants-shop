<template>
  <div
    v-if="product"
    class="product">
    <img
      :src="`/images/products/${product.img}`"
      alt="product-image"
      class="image" />
    <div class="info">
      <Breadcrumb
        :home="home"
        :model="items" />
      <h1>{{ product.name }}</h1>
      <Rating
        :readonly="true"
        :cancel="false"
        :model-value="product.rating" />
      <p class="price">$ {{ product.price }}</p>
      <p class="description">{{ product.description }}</p>
      <p class="characteristic"><span class="characteristic-name">SKU:</span>{{ product.id }}</p>
      <div class="characteristic">
        <span class="characteristic-name">Categories:</span>
        <p
          v-for="category in product.categories"
          :key="category">
          {{ category }}
        </p>
      </div>
      <div
        class="characteristic"
        v-if="product.badges.length">
        <span class="characteristic-name">Tags:</span>
        <p
          v-for="badge in product.badges"
          :key="badge">
          {{ badge }}
        </p>
      </div>
      <div class="characteristic">
        <p class="characteristic-name">Potter colors:</p>
        <div
          v-for="color in product.colors"
          :key="color"
          class="color"
          :class="color"></div>
      </div>
      <Button class="p-button-lg">Add to cart</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import type { IProduct } from '@/types/product';

import { fetchProductById } from '@/api/catalog';

const route = useRoute();

const product = ref<IProduct>();

const home = ref({
  icon: 'pi pi-home',
  to: '/',
});

const items = [{ label: 'catalog', url: '/catalog' }];

onMounted(async () => {
  product.value = await fetchProductById(+route.params.id);
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.product {
  background: $image-background-color;
  display: flex;
  gap: 50px;
  &__colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.description {
  text-align: left;
}

.characteristic {
  display: flex;
  gap: 10px;
}

.characteristic-name {
  font-weight: bold;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  padding: 70px 0;
}
.image {
  max-width: 500px;
  height: 100%;
  border-radius: 5px 5px 0 0;
}

.price {
  font-size: 24px;
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

::v-deep(.p-breadcrumb-list) {
  text-transform: uppercase;
  font-size: 14px;
}

::v-deep(.p-breadcrumb .p-breadcrumb-list li:last-child .p-menuitem-text) {
  color: $primary-color;
}
::v-deep(.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-icon) {
  color: $primary-color;
}

::v-deep(.p-breadcrumb .p-breadcrumb-list li.p-menuitem-separator) {
  color: $primary-color;
}

::v-deep(.p-breadcrumb) {
  padding: 0;
  background: none;
  border: none;
}
</style>