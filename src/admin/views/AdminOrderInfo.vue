<template>
  <div
    v-if="order"
    class="order-info">
    <h1>Order detail (ID: #{{ order.id }})</h1>

    <div
      v-if="order"
      class="details">
      <div
        v-for="card in cards"
        :key="card.header"
        class="detail-card">
        <p class="card-header">{{ card.header }}:</p>
        <div class="card-info">
          <div
            v-for="(row, index) in card.rows"
            :key="index">
            {{ row }}
          </div>
        </div>
      </div>
    </div>

    <DataTable
      :value="order.cart"
      responsive-layout="scroll"
      removable-sort
      class="table"
      selection-mode="single">
      <Column header="IMAGE">
        <template #body="slotProps">
          <img
            :src="`/images/products/${slotProps.data.img}`"
            alt="product-img"
            class="product-image" />
        </template>
      </Column>
      <Column header="PRODUCT">
        <template #body="slotProps">
          <p>{{ slotProps.data.name }}</p>
        </template>
      </Column>

      <Column header="COLOR">
        <template #body="slotProps">
          <div
            class="color"
            :class="slotProps.data.color"></div>
        </template>
      </Column>
      <Column header="QUANTITY">
        <template #body="slotProps">
          <p>{{ slotProps.data.quantity }}</p>
        </template>
      </Column>
      <Column header="PRICE">
        <template #body="slotProps">
          <p>${{ slotProps.data.price }}</p>
        </template>
      </Column>

      <Column header="SUBTOTAL">
        <template #body="slotProps">
          <p>${{ slotProps.data.totalCost }}</p>
        </template>
      </Column>
    </DataTable>
    <div class="order-total-detail">
      <div>
        <strong>Products Total:</strong>
        <p>${{ order.productsTotal }}</p>
      </div>
      <div>
        <strong>Shipping Cost:</strong>
        <p>${{ order.shippingCost }}</p>
      </div>
      <div class="total-cost">
        <strong>Total:</strong>
        <p>${{ order.totalCost }}</p>
      </div>
      <div>
        <strong>Status:</strong>
        <p
          class="order-status"
          :style="{ color: order.status.color }">
          {{ order.status.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import type { IOrder } from '@/types/order';

import { fetchOrderById } from '../api/admin';

import { dateFormatterFull } from '@/helpers/dateFormatter';

const route = useRoute();

const order = ref<IOrder>();

const cards = ref([{ header: '', rows: ['', 0] }]);

onMounted(async () => {
  order.value = await fetchOrderById(+route.params.id);
  cards.value = [
    {
      header: 'Customer',
      rows: [order.value?.firstName, order.value?.lastName, order.value?.email, order.value?.phone],
    },
    { header: 'Shipped to', rows: [order.value?.country, order.value?.city, order.value?.address] },
    { header: 'Payment', rows: [order.value?.payment.label] },
    { header: 'Date', rows: [dateFormatterFull(order.value?.date)] },
  ];
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.total-cost {
  background-color: $complementary-color;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.color {
  width: 30px;
  height: 30px;
}

.details {
  display: flex;
  gap: 20px;
}
.detail-card {
  border-radius: 10px;
  border: 1px solid $complementary-color;
  width: 25%;
}

.card-header {
  background: $complementary-color;
  border-radius: 10px 10px 0 0;
  padding: 5px;
}

.card-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.product-image {
  width: 50px;
  height: 100%;
}

.order-total-detail {
  display: flex;
  flex-direction: column;

  & div {
    display: flex;
    gap: 50px;
    width: 50%;
    padding: 5px;
    justify-content: space-between;
    align-self: flex-end;
  }
}
</style>
