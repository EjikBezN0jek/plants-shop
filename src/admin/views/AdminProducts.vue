<template>
  <div>
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
      <Column header="BADGES">
        <template #body="slotProps">
          <div
            v-for="badge in slotProps.data.badges"
            :key="badge">
            {{ badge }}
          </div>
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
              @click="removeHandler(slotProps.data.id)" />
          </div>
        </template>
      </Column>
      <Toast />
      <ConfirmDialog></ConfirmDialog>
    </DataTable>

    <ClassicPagination
      :pagination="pagination"
      @change-page="changePage"
      class="pagination" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Button from 'primevue/button';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IProduct } from '@/types/product';

import ClassicPagination from '@/components/ClassicPagination.vue';

import { fetchAllProducts } from '@/api/catalog';

import { removeProduct } from '../api/admin';

import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';

const confirm = useConfirm();
const toast = useToast();

const products = ref<IProduct[]>();

const { pagination, setPagination, setCurrentPage, resetCurrentPage } = usePagination();

const sortHandler = e => {
  console.log(e);
};

const getProducts = async () => {
  const params = {
    // colors_like: colorsSelected.value,
    // categories_like: categorySelected.value,
    // badges_like: badgesSelected.value,
    // name_like: searchQuery.value,
    // _sort: sorting.value.target,
    // _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 8,
    // price_gte: pricesSelected.value?.min,
    // price_lte: pricesSelected.value?.max,
  };

  const { data, pagination: p } = await fetchAllProducts(params);
  products.value = data;
  setPagination(p);
};

const changePage = (page: number) => {
  setCurrentPage(page);
  getProducts();
};

const refetchProducts = () => {
  resetCurrentPage();
  getProducts();
};

const removeHandler = (id: number) => {
  confirm.require({
    message: 'Do you want to delete this product?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      removeProduct(id);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Product deleted', life: 3000 });
      refetchProducts();
    },
  });
};

onMounted(async () => {
  getProducts();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.table {
  flex-grow: 1;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  height: 130px;
}

h1 {
  padding: 0 0 10px;
}

.product {
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: $table-text-color;
  cursor: pointer;
}
.product-image {
  width: 50px;
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
