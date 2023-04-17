<template>
  <div>
    <h1>Products ({{ productsAllCount }})</h1>

    <div class="row">
      <CatalogSearch
        v-model="searchQuery"
        @update:model-value="searchProducts" />

      <Button @click="openModal">ADD NEW PRODUCT</Button>

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
          <h5>Product Successful!</h5>
        </div>
      </Dialog>

      <ProductModal
        v-if="isModalOpen"
        @close-modal="closeModal"
        :colors="colors"
        v-model:state="state"
        :badges="badges"
        :categories="categories"
        :submitted="submitted"
        :is-edit-product="isEditProduct"
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
            class="product"
            target="_blank">
            <p>{{ slotProps.data.name }}</p>
          </router-link>
        </template>
      </Column>

      <Column header="POTTER COLORS">
        <template #body="slotProps">
          <div class="colors">
            <div
              v-for="color in findColors(slotProps.data)"
              :key="color.id"
              class="color"
              :class="color.name"
              :style="{ background: color.code }"></div>
          </div>
        </template>
      </Column>
      <Column header="CATEGORIES">
        <template #body="slotProps">
          <div
            v-for="category in findCategories(slotProps.data)"
            :key="category.id">
            <p>{{ category.label }}</p>
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
      v-if="products?.length" />
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

import type { IProduct } from '@/types/product';

import ClassicPagination from '@/components/ClassicPagination.vue';
import CatalogSearch from '@/components/CatalogSearch.vue';
import ProductModal from '@/admin/components/ProductModal.vue';

import { fetchAllProducts, fetchAllColors, fetchAllCategories, fetchAllBadges } from '@/api/catalog';

import { removeProduct, addProduct, addEditingProduct } from '../api/admin';

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
const badges = ref<IBadge[]>();
const categories = ref<ICategory[]>();

const state = ref({
  id: null,
  name: '',
  categories: [],
  colors: [],
  badges: [],
  description: '',
  price: null,
  img: 'product-30.jpg',
});

const { pagination, setPagination, setCurrentPage, resetCurrentPage } = usePagination();

const findColors = (product: IProduct) => {
  if (colors.value) return colors.value.filter(color => product.colors.includes(color.id));
};

const findCategories = (product: IProduct) => {
  if (categories.value) return categories.value.filter(category => product.categories.includes(category.id));
};

const isModalOpen = ref(false);
const body = document.querySelector('body');

const openModal = () => {
  isModalOpen.value = true;
  body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditProduct.value = false;
  body.style.overflow = 'auto';
  cleanForm();
  refetchProducts();
};

const cleanForm = () => {
  state.value.name = '';
  state.value.categories = [];
  state.value.colors = [];
  state.value.badges = [];
  state.value.description = '';
  state.value.price = null;
  state.value.img = 'product-30.jpg';
  submitted.value = false;
};

const isEditProduct = ref(false);

const editProduct = (product: IProduct) => {
  isEditProduct.value = true;
  openModal();
  state.value.id = product.id;
  state.value.name = product.name;
  state.value.categories = product.categories;
  state.value.colors = product.colors;
  state.value.badges = product.badges;
  state.value.description = product.description;
  state.value.price = product.price;
  state.value.img = product.img;
};

const placeEditingProduct = () => {
  const editingProduct = {
    id: state.value.id,
    name: state.value.name,
    price: state.value.price,
    colors: state.value.colors,
    categories: state.value.categories,
    badges: state.value.badges,
    description: state.value.description,
  };
  addEditingProduct(editingProduct);
};

const placeProduct = () => {
  const newProduct = {
    date: Date.now(),
    name: state.value.name,
    price: state.value.price,
    colors: state.value.colors,
    categories: state.value.categories,
    rating: 0,
    badges: [10],
    description: state.value.description,
    img: 'product-30.jpg',
  };
  addProduct(newProduct);
};
const submitted = ref(false);
const isSuccessful = ref(false);

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (isEditProduct.value) {
      placeEditingProduct();
    } else {
      placeProduct();
    }
    closeModal();
    toggleDialog();
  }
};

//Sorting
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

const productsAllCount = ref(0);

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
  productsAllCount.value = p.items;
  setPagination(p);
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
