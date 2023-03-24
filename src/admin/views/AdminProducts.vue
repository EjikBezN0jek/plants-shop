<template>
  <div class="content">
    <TheHeader />
    <h1>This is products</h1>
    <DataTable
      :value="products"
      responsive-layout="scroll"
      removable-sort
      class="table"
      @sort="sortHandler">
      <Column header="PRODUCT">
        <template #body="slotProps">
          <img
            :src="`/images/products/${slotProps.data.img}`"
            alt="product-img"
            class="product-image" />
        </template>
      </Column>
      <Column
        header="NAME"
        field="name"
        sortable>
        <template #body="slotProps">
          <router-link
            :to="{ name: 'product', params: { id: slotProps.data.id, name: slotProps.data.name } }"
            class="product">
            <p>{{ slotProps.data.name }}</p>
          </router-link>
        </template>
      </Column>

      <Column header="POTTER COLORS">
        <template #body="slotProps">
          <div class="colors">
            <div
              v-for="color in slotProps.data.colors"
              :key="color.id"
              class="color"
              :class="color"></div>
          </div>
        </template>
      </Column>
      <Column header="CATEGORIES">
        <template #body="slotProps">
          <div
            v-for="category in slotProps.data.categories"
            :key="category">
            <p>{{ category }}</p>
          </div>
        </template>
      </Column>
      <Column
        header="PRICE"
        field="price"
        sortable>
        <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
      </Column>
      <Column
        header="RATING"
        sortable
        field="rating">
        <template #body="slotProps">
          <Rating
            :readonly="true"
            :cancel="false"
            :model-value="slotProps.data.rating" />
        </template>
      </Column>
      <Column
        header="DATE"
        field="date"
        sortable>
        <template #body="slotProps">
          <p>{{ dateFormatter(slotProps.data.date) }}</p>
        </template>
      </Column>
      <Column header="ACTION">
        <template #body="slotProps">
          <div class="action-buttons">
            <Button
              icon="pi pi-pencil"
              @click="editProduct(slotProps.data)" />
            <Button
              icon="pi pi-times"
              @click="removeProduct(slotProps.data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Button from 'primevue/button';

import TheHeader from '@/admin/components/TheHeader.vue';

import type { IProduct } from '@/types/product';

import { fetchAllProducts } from '../api/admin';
import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';

const products = ref<IProduct[]>();

const { pagination, setPagination, resetCurrentPage, setCurrentPage } = usePagination();

const sortHandler = e => {
  console.log(e);
};

onMounted(async () => {
  const { data, pagination: p } = await fetchAllProducts();
  products.value = data;
  setPagination(p);
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.content {
  margin-left: 250px;
}

.product {
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  cursor: pointer;
  color: $table-text-color;
}
.product-image {
  width: 50px;
  height: 100%;
}

.colors {
  display: flex;
  gap: 5px;
}

.color {
  width: 30px;
  height: 30px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
