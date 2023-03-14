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

    <Accordion :multiple="true">
      <AccordionTab
        v-for="order in ordersSort()"
        :key="order.id">
        <template #header>
          <div class="accordion-header">
            <div class="accordion-wrapper">
              <p>Order id: {{ order.id }}</p>
              <p class="date">{{ dateFormatter(order.date) }}</p>
            </div>

            <p
              class="order-status"
              :class="order.status.name">
              {{ order.status.label }}
            </p>
          </div>
        </template>

        <StepsWidget
          :order-status-items="orderStatusItems"
          :current-status="order.status.name"></StepsWidget>

        <router-link
          :to="{ name: 'product', params: { id: product.id, name: product.name } }"
          v-for="product in order.cart"
          :key="product.id"
          class="product link">
          <img
            :src="`/images/products/${product.img}`"
            alt="product-img"
            class="product-image product-item" />
          <div class="product-info product-item">
            <p class="product-name">{{ product.name }}</p>
            <div
              class="color"
              :class="product.color"></div>
          </div>

          <p class="product-item">${{ product.price }}</p>
          <p class="product-item">x {{ product.quantity }}</p>
        </router-link>
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
              <p>${{ order.totalCost }}</p>
            </div>
          </div>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import StepsWidget from '@/components/StepsWidget.vue';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

import { dateFormatter } from '@/helpers/dateFormatter';

import type { IOrder } from '@/types/order';
import type { IOrderStatus } from '@/types/orderStatus';

import { fetchUserOrders, fetchAllOrderStatus } from '@/api/user';

const orders = ref<IOrder[]>();
const orderStatusItems = ref<IOrderStatus[]>();

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
  orderStatusItems.value = await fetchAllOrderStatus();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

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
}

.color {
  flex-shrink: 0;
}

.order-info {
  background: $image-background-color;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @include sm {
    align-items: flex-start;
    flex-direction: row;
    gap: 50px;
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

::v-deep(.p-accordion.p-component) {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

::v-deep(.p-accordion .p-accordion-content) {
  padding: 1rem 0 0;
}
::v-deep(.p-accordion .p-accordion-tab .p-accordion-header .p-accordion-header-link),
::v-deep(.p-accordion .p-accordion-tab:last-child .p-accordion-header:not(.p-highlight) .p-accordion-header-link) {
  border-radius: 10px;
  border: 1px solid $complementary-color;
  display: flex;
  gap: 10px;
}
::v-deep(.p-accordion .p-accordion-tab-active .p-accordion-header .p-accordion-header-link) {
  border-radius: 10px 10px 0 0;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 10px;
}

.accordion-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

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

.order-status {
  flex-shrink: 0;

  &.pending {
    color: rgb(94, 148, 211);
  }
  &.ready-to-ship {
    color: rgb(211, 211, 94);
  }
  &.on-the-way {
    color: rgb(211, 150, 94);
  }
  &.delivered {
    color: $primary-color;
  }
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
  font-size: 12px;
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
