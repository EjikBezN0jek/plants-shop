<template>
  <div>
    <h1>Orders ({{ ordersAllCount }})</h1>

    <DataTable
      :value="orders"
      responsive-layout="scroll"
      removable-sort
      class="table"
      @sort="sortHandler"
      v-if="orders?.length"
      selection-mode="single"
      @row-select="onRowSelect">
      <Column header="ID">
        <template #body="slotProps">
          <p>{{ slotProps.data.id }}</p>
        </template>
      </Column>
      <Column header="CUSTOMER">
        <template #body="slotProps">
          <p>{{ slotProps.data.firstName }} {{ slotProps.data.lastName }}</p>
        </template>
      </Column>
      <Column header="EMAIL">
        <template #body="slotProps">
          <p>{{ slotProps.data.email }}</p>
        </template>
      </Column>
      <Column header="ITEMS">
        <template #body="slotProps">
          <p>{{ slotProps.data.cart.length }}</p>
        </template>
      </Column>
      <Column
        header="TOTAL COST"
        field="totalCost"
        sortable>
        <template #body="slotProps">
          <p>${{ slotProps.data.totalCost }}</p>
        </template>
      </Column>

      <Column header="PAYMENT">
        <template #body="slotProps">
          <p>{{ slotProps.data.payment.label }}</p>
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
      <Column
        header="STATUS"
        field="status"
        sortable>
        <template #body="slotProps">
          <p class="status">
            {{ slotProps.data.status.label }}
          </p>
        </template>
      </Column>
      <Column header="ACTION">
        <template #body="slotProps">
          <div class="action-buttons">
            <Button
              icon="pi pi-check"
              @click="moderateReview(slotProps.data)"
              v-if="!slotProps.data.isModerate" />
            <Button
              icon="pi pi-ban"
              @click="removeHandler(slotProps.data)" />
          </div>
        </template>
      </Column>
      <Toast />
      <ConfirmDialog></ConfirmDialog>
    </DataTable>

    <h2 v-else>No orders!</h2>

    <ClassicPagination
      :pagination="pagination"
      @change-page="changePage"
      class="pagination"
      v-if="orders?.length" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Row from 'primevue/row';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IOrder } from '@/types/order';

import ClassicPagination from '@/components/ClassicPagination.vue';

import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';

import { fetchAllOrders, changeOrderStatus } from '../api/admin';

const { pagination, setPagination, setCurrentPage, resetCurrentPage } = usePagination();

const confirm = useConfirm();
const toast = useToast();

const orders = ref<IOrder[]>();

const ordersAllCount = ref(0);

const sortHandler = e => {
  sorting.value.target = e.sortField;
  if (e.sortOrder === 1) sorting.value.order = 'asc';
  if (e.sortOrder === -1) sorting.value.order = 'desc';
  getOrders();
};

const sorting = ref({ target: '', order: '' });

const getOrders = async () => {
  const params = {
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 3,
  };

  const { data, pagination: p } = await fetchAllOrders(params);
  orders.value = data;
  ordersAllCount.value = p.items;
  setPagination(p);
};

const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onRowSelect = e => {
  // console.log(e.data.id);

  router.push({ name: 'order', params: { id: e.data.id } });
};

const changePage = (page: number) => {
  setCurrentPage(page);
  getOrders();
  scrollUp();
};
onMounted(async () => {
  getOrders();
});
</script>

<style scoped lang="scss"></style>
