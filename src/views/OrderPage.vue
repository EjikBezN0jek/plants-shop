<template>
  <div
    v-if="order"
    class="container">
    <h1 class="title">Order {{ order.id }}</h1>
    <small>{{ dateFormatter(order.date) }}</small>

    <div class="order-info">
      <div class="order-info-wrapper">
        <div class="order-info-item">
          <i class="pi pi-user"></i>
          <div class="wrapper">
            <strong>Customer</strong>
            <p>{{ order.firstName }} {{ order.lastName }}</p>
            <p>{{ order.email }}</p>
            <p>{{ order?.phone }}</p>
          </div>
        </div>
        <div class="order-info-item">
          <i class="pi pi-map-marker"></i>
          <div class="wrapper">
            <strong>Address</strong>
            <p class="address">{{ order.country }}, {{ order.city }}, {{ order.address }}</p>
          </div>
        </div>
      </div>

      <div class="order-info-wrapper">
        <div class="order-info-item">
          <i class="pi pi-credit-card"></i>
          <p>{{ order.payment.label }}</p>
        </div>
        <div class="order-info-item">
          <strong>Subtotal</strong>
          <p class="subtotal">${{ order.productsTotal }}</p>
        </div>
        <div class="order-info-item">
          <strong>Shipping</strong>
          <p>${{ order.shippingCost }}</p>
        </div>
        <div class="order-info-item">
          <strong>Total</strong>
          <p class="total">${{ order.totalCost }}</p>
        </div>
        <div class="order-info-item">
          <strong>Status</strong>
          <p
            class="status"
            :class="order.status.name">
            {{ order.status.label }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-for="product in order.cart"
      :key="product.id"
      class="product">
      <img
        :src="`/images/products/${product.img}`"
        alt="product-img"
        class="product-image product-item" />
      <div class="product-info">
        <p class="product-name">{{ product.name }}</p>
        <div
          class="color"
          :class="product.color"></div>
      </div>

      <p class="product-item">${{ product.price }}</p>
      <p class="product-item">x {{ product.quantity }}</p>
    </div>

    <!-- <p>{{ order }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import type { IOrder } from '@/types/order';

import { dateFormatter } from '@/helpers/dateFormatter';

import { fetchOrderById } from '@/api/user';
const route = useRoute();

const order = ref<IOrder>();

onMounted(async () => {
  order.value = await fetchOrderById(+route.params.id);
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.order-info {
  background: $image-background-color;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px 10px 0 0;

  @include sm {
    align-items: flex-start;
    flex-direction: row;
    gap: 30px;
    justify-content: center;
  }
}

.order-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-info-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  & .pi {
    font-size: 1.5rem;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.address {
  text-align: left;
  width: auto;
}

.product {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  justify-content: space-between;
}

.product-item {
  width: 25%;
  flex-shrink: 0;
}

.color {
  flex-shrink: 0;
}

.product-name {
  text-align: left;
  flex-shrink: 1;
}

.product-image {
  width: 100px;
  height: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  @include sm {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 25%;
  }
}
</style>
