<template>
  <div>
    <h1>Reviews</h1>

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
      :value="reviews"
      responsive-layout="scroll"
      removable-sort
      class="table"
      @sort="sortHandler"
      v-if="reviews?.length">
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

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IReview } from '@/types/review';

import { fetchAllReviews, addModeratingReview, changeRating, removeReview } from '../api/admin';

import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';

const { pagination, setPagination, setCurrentPage, resetCurrentPage } = usePagination();

const confirm = useConfirm();
const toast = useToast();

const reviews = ref<IReview[]>();

const reviewsAllCount = ref(0);

const sortHandler = e => {
  sorting.value.target = e.sortField;
  console.log(sorting.value.target, e.sortOrder);

  if (e.sortOrder === 1) sorting.value.order = 'asc';
  if (e.sortOrder === -1) sorting.value.order = 'desc';
  getReviews();
};

const sorting = ref({ target: '', order: '' });

const getReviews = async () => {
  const params = {
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 8,
  };

  const { data, pagination: p } = await fetchAllReviews(params);
  reviews.value = data;
  reviewsAllCount.value = p.items;
  setPagination(p);
};

const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const changePage = (page: number) => {
  setCurrentPage(page);
  getReviews();
  scrollUp();
};

const refetchReviews = () => {
  resetCurrentPage();
  getReviews();
};

const isSuccessful = ref(false);

const recalculationRating = async (id: number) => {
  await getReviews();
  const allReviews = reviews.value?.filter(item => item.productId === id && item.isModerate);
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
      refetchReviews();
    },
  });
};

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const closeModal = () => {
  refetchReviews();
};

onMounted(async () => {
  getReviews();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}
.moderated {
  color: $primary-color;
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
