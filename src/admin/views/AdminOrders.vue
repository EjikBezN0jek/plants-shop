<template>
  <div>
    <h1>Orders ({{ ordersAllCount }})</h1>

    <DataTable
      :value="orders"
      responsive-layout="scroll"
      removable-sort
      class="table"
      @sort="sortHandler"
      v-if="orders?.length">
      <Column header="ID">
        <template #body="slotProps">
          <p>{{ slotProps.data.id }}</p>
        </template>
      </Column>
      <Column header="CUSTOMER">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'order', params: { id: slotProps.data.id } }"
            target="_blank"
            class="order">
            <p>{{ slotProps.data.firstName }} {{ slotProps.data.lastName }}</p>
          </router-link>
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
        field="status.label"
        sortable>
        <template #body="slotProps">
          <Dropdown
            v-model="slotProps.data.status"
            :options="orderStatusItems"
            option-label="label"
            :class="slotProps.data.status.name"
            @change="editOrderStatus(slotProps.data.id, slotProps.data.status)" />
        </template>
      </Column>
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

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';

import type { IOrder } from '@/types/order';
import type { IOrderStatus } from '@/types/orderStatus';

import ClassicPagination from '@/components/ClassicPagination.vue';

import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';

import { fetchAllOrders, changeOrderStatus } from '../api/admin';
import { fetchAllOrderStatus } from '@/api/user';

const { pagination, setPagination, setCurrentPage } = usePagination();

const orders = ref<IOrder[]>();
const ordersAllCount = ref(0);
const orderStatusItems = ref<IOrderStatus[]>();

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

const editOrderStatus = (id: number, status: IOrderStatus) => {
  const editingOrder = {
    status: status,
  };
  changeOrderStatus(id, editingOrder);
};

const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const changePage = (page: number) => {
  setCurrentPage(page);
  getOrders();
  scrollUp();
};
onMounted(async () => {
  getOrders();
  orderStatusItems.value = await fetchAllOrderStatus();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.order {
  color: $table-text-color;
  cursor: pointer;
}

::v-deep(.p-dropdown.p-component.p-inputwrapper.p-inputwrapper-filled) {
  width: 100%;

  &.pending {
    & .p-inputtext {
      color: rgb(94, 148, 211);
    }
  }
  &.ready-to-ship {
    & .p-inputtext {
      color: rgb(211, 211, 94);
    }
  }
  &.on-the-way {
    & .p-inputtext {
      color: rgb(211, 150, 94);
    }
  }
  &.delivered {
    & .p-inputtext {
      color: $primary-color;
    }
  }
}

.select {
  position: absolute;
  top: 25px;
  right: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 10px;
  border: 1px solid $primary-color;
}
// .status {
//   display: flex;
//   gap: 5px;
//   align-items: center;
//   position: relative;
// }

.status-btn {
  background: none;
  border: none;
  color: $secondary-color;
}
</style>
