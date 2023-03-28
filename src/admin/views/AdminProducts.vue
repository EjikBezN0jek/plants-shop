<template>
  <div>
    <h1>Products {{ state.name }}</h1>

    <div class="row">
      <CatalogSearch
        v-model="searchQuery"
        @update:model-value="searchProducts" />

      <Button @click="openModal">ADD NEW PRODUCT</Button>
      <ProductModal
        v-if="isModalOpen"
        @close-modal="closeModal"
        :colors="colors"
        v-model:state="state"
        :badges="badges"
        :categories="categories"
        :submitted="submitted"
        @handle-submit="handleSubmit" />
    </div>

    <DataTable
      :value="products"
      responsive-layout="scroll"
      removable-sort
      class="table"
      @sort="sortHandler"
      v-if="products?.length">
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
    <h2 v-else>No products!</h2>

    <ClassicPagination
      :pagination="pagination"
      @change-page="changePage"
      class="pagination"
      v-if="products?.length" />
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
import CatalogSearch from '@/components/CatalogSearch.vue';
import ProductModal from '@/admin/components/ProductModal.vue';

import { fetchAllProducts, fetchAllColors, fetchAllCategories, fetchAllBadges } from '@/api/catalog';

import { removeProduct, addProduct } from '../api/admin';

import { usePagination } from '@/hooks/usePagination';

import { dateFormatter } from '@/helpers/dateFormatter';
import { debounce } from '@/helpers/debounce';

import { IColor } from '@/types/color';
import { IBadge } from '@/types/badge';
import { ICategory } from '@/types/category';

const confirm = useConfirm();
const toast = useToast();

const products = ref<IProduct[]>();
const colors = ref<IColor[]>();
// const colorsSelected = ref<string[]>([]);
const badges = ref<IBadge[]>();
// const badgesSelected = ref<string[]>([]);
const categories = ref<ICategory[]>();
// const categoriesSelected = ref<string[]>([]);
// const name = ref('');
// const price = ref(0);
// const description = ref('');

const state = ref({
  name: '',
  categories: [''],
  colors: [''],
  badges: [''],
  description: '',
  price: null,
});

const { pagination, setPagination, setCurrentPage, resetCurrentPage } = usePagination();

const isModalOpen = ref(false);
const body = document.querySelector('body');

const openModal = () => {
  isModalOpen.value = true;
  body.style.overflow = 'hidden';
};

// const cleanForm = () => {
//   colorsSelected.value = [];
//   badgesSelected.value = [];
//   categoriesSelected.value = [];
//   name.value = '';
//   price.value = 0;
//   description.value = '';
// };

const closeModal = () => {
  isModalOpen.value = false;
  // cleanForm();
};

const placeProduct = () => {
  const newProduct = {
    date: Date.now(),
    // firstName: state.value.firstName,
  };
  // addProduct(newProduct);
  // closeModal();
};
const submitted = ref(false);
const isSuccessful = ref(false);

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  // if (isFormValid) {
  //   placeOrder();
  //   toggleDialog();
  //   resetForm();
  // }
};

const sortHandler = e => {
  sorting.value.target = e.sortField;
  if (e.sortOrder === 1) sorting.value.order = 'asc';
  if (e.sortOrder === -1) sorting.value.order = 'desc';
  getProducts();
};

const sorting = ref({ target: '', order: '' });

const searchQuery = ref('');

const searchProducts = debounce(() => {
  refetchProducts();
}, 300);

const getProducts = async () => {
  const params = {
    name_like: searchQuery.value,
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 8,
  };

  const { data, pagination: p } = await fetchAllProducts(params);
  products.value = data;
  setPagination(p);
  resetCurrentPage();
};

const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const changePage = (page: number) => {
  setCurrentPage(page);
  getProducts();
  scrollUp();
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
  isModalOpen.value = false;
  colors.value = await fetchAllColors();
  badges.value = await fetchAllBadges();
  categories.value = await fetchAllCategories();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.row {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

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
