<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <Dialog
      v-model:visible="isSuccessful"
      @hide="closeModal()"
      :breakpoints="{ '960px': '80vw' }"
      :style="{ width: '30vw' }"
      :modal="true"
      :dismissable-mask="true">
      <template #header>
        <h3>Successful</h3>
      </template>
      <div class="flex align-items-center flex-column pt-6 px-3">
        <i
          class="pi pi-check-circle"
          :style="{ fontSize: '5rem', color: 'var(--green-500)' }"></i>
        <h5>Review moderated successful!</h5>
      </div>
    </Dialog>

    <DataTable
      responsive-layout="scroll"
      removable-sort
      class="table"
      v-if="newOrders?.length"
      :value="newOrders">
      <template #header>
        <div class="header">
          <span class="text-xl text-900 font-bold">New Orders</span>
          <Button
            icon="pi pi-refresh"
            class="refresh-btn"
            @click="getNewOrders" />
        </div>
      </template>
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

    <DataTable
      responsive-layout="scroll"
      removable-sort
      class="table"
      v-if="newReviews?.length"
      :value="newReviews">
      <template #header>
        <div class="header">
          <span class="text-xl text-900 font-bold">New Reviews</span>
          <Button
            icon="pi pi-refresh"
            class="refresh-btn"
            @click="getNewReviews" />
        </div>
      </template>

      <Column header="PRODUCT">
        <template #body="slotProps">
          <img
            :src="`/images/products/${slotProps.data.productImage}`"
            alt="product-img"
            class="product-image" />
        </template>
      </Column>
      <Column
        header="NAME"
        field="productName"
        sortable>
        <template #body="slotProps">
          <router-link
            :to="{ name: 'product', params: { id: slotProps.data.productId, name: slotProps.data.productName } }"
            class="product"
            target="_blank">
            <p>{{ slotProps.data.productName }}</p>
          </router-link>
        </template>
      </Column>
      <Column header="CUSTOMER">
        <template #body="slotProps">{{ slotProps.data.userName }} </template>
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
      <Column header="COMMENT">
        <template #body="slotProps">
          <p>{{ slotProps.data.comment }}</p>
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
        field="isModerated"
        sortable>
        <template #body="slotProps">
          <p
            v-if="slotProps.data.isModerate"
            class="moderated">
            Moderated
          </p>
          <p
            v-else
            class="error">
            Not moderated
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  fetchAllReviews,
  addModeratingReview,
  changeRating,
  removeReview,
  fetchAllOrders,
  changeOrderStatus,
} from '../api/admin';
import { fetchAllOrderStatus } from '@/api/user';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IReview } from '@/types/review';
import type { IOrder } from '@/types/order';
import type { IOrderStatus } from '@/types/orderStatus';

import { dateFormatter } from '@/helpers/dateFormatter';

const confirm = useConfirm();
const toast = useToast();

const newReviews = ref<IReview[]>();
const newOrders = ref<IOrder[]>();

const orderStatusItems = ref<IOrderStatus[]>();

const isSuccessful = ref(false);

const editOrderStatus = (id: number, status: IOrderStatus) => {
  const editingOrder = {
    status: status,
  };
  changeOrderStatus(id, editingOrder);
};

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const closeModal = () => {
  getNewReviews();
};

const getNewReviews = async () => {
  const params = {
    _sort: 'date',
    _order: 'desc',
    _limit: 2,
  };

  const { data } = await fetchAllReviews(params);
  newReviews.value = data;
};

const getNewOrders = async () => {
  const params = {
    _sort: 'date',
    _order: 'desc',
    _limit: 2,
  };

  const { data } = await fetchAllOrders(params);
  newOrders.value = data;
};

const recalculationRating = async (id: number) => {
  await getNewReviews();
  const allReviews = newReviews.value?.filter(item => item.productId === id && item.isModerate);
  const newRating = ref(0);
  if (allReviews) {
    newRating.value = +(allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length).toFixed(1);
  }
  const newRatingProduct = {
    rating: newRating.value,
  };
  changeRating(id, newRatingProduct);
};

const moderateReview = (review: IReview) => {
  const moderatingReview = {
    id: review.id,
    isModerate: true,
  };
  addModeratingReview(moderatingReview);
  recalculationRating(review.productId);
  toggleDialog();
};

const removeHandler = (review: IReview) => {
  confirm.require({
    message: 'Do you want to delete this review?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      removeReview(review.id);
      recalculationRating(review.productId);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Review deleted', life: 3000 });
      getNewReviews();
    },
  });
};

onMounted(async () => {
  getNewReviews();
  getNewOrders();
  orderStatusItems.value = await fetchAllOrderStatus();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 50px;
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

.refresh-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.moderated {
  color: $primary-color;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.order {
  color: $table-text-color;
  cursor: pointer;
}

.product {
  display: flex;
  align-items: center;
  gap: 20px;
  color: $table-text-color;
  cursor: pointer;
}

.product-image {
  width: 50px;
}
</style>
