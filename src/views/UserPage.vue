<template>
  <div class="container user">
    <Button
      class="p-button-sm quit-btn"
      @click="quitFromAccount">
      Quit
      <i
        class="pi pi-sign-out"
        style="font-size: 0.75rem"></i>
    </Button>

    <div class="orders">
      <router-link
        :to="{ name: 'order', params: { id: order.id } }"
        v-for="order in ordersSort()"
        :key="order.id"
        class="order link">
        <div class="order-header">
          <div class="header-row">
            <p class="date">{{ dateFormatter(order.date) }}</p>
            <p class="total">${{ order.totalCost }}</p>
          </div>
          <div class="header-row">
            <p>id: {{ order.id }}</p>
            <p
              class="status"
              :class="order.status.name">
              {{ order.status.label }}
            </p>
          </div>
        </div>
        <div
          v-for="product in order.cart"
          :key="product.id"
          class="product">
          <img
            :src="`/images/products/${product.img}`"
            alt="product-img"
            class="product-image" />
          <div class="product-info">
            <p class="product-name">{{ product.name }}</p>
            <div
              class="color"
              :class="product.color"></div>
          </div>

          <p>${{ product.price }}</p>
          <p>x {{ product.quantity }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import Button from 'primevue/button';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

import { dateFormatter } from '@/helpers/dateFormatter';

import type { IOrder } from '@/types/order';

import { fetchUserOrders } from '@/api/user';

const orders = ref<IOrder[]>();

const user = useInject(UserKey);

const ordersSort = () => {
  return orders.value?.sort((a, b) => b.date - a.date);
};

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push('/');
};

onMounted(async () => {
  if (user.value) orders.value = await fetchUserOrders(user.value);
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.user {
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  gap: 20px;
  @include sm {
    padding: 20px;
  }
}

.orders {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.order {
  border-radius: 10px;
  border: 1px solid $complementary-color;
}
.order-header {
  background: $image-background-color;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px 10px 0 0;
}

.header-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.total {
  font-weight: bold;
  color: $primary-color;
  font-size: 22px;
}

.date {
  flex-shrink: 0;
}

.product {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
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

.quit-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: flex-end;
}
</style>
