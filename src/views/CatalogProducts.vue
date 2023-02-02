<template>
  <div>
    <CatalogSearch
      v-model="searchQuery"
      @update:model-value="searchProducts" />

    <p>All products: {{ pagination.items }}</p>

    <ProductList :products="products" />

    <CatalogPagination
      v-if="pagination.last > 1"
      :pagination="pagination"
      @change-page="changePage" />

    <CatalogSorting
      v-model="sorting"
      @update:model-value="refetchProducts" />

    <CatalogFilters
      v-model:colors="colorsSelected"
      @update:colors="refetchProducts"
      v-model:category="categorySelected"
      @update:category="goToCategory"
      :colors-list="colorsList"
      :categories-list="categoriesList"
      :prices="prices" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { fetchAllProducts, fetchAllCategories, fetchAllColors, fetchAllPrices } from '@/api/catalog';

import CatalogPagination from '@/components/CatalogPagination.vue';
import CatalogSearch from '@/components/CatalogSearch.vue';
import CatalogSorting from '@/components/CatalogSorting.vue';
import CatalogFilters from '@/components/CatalogFilters.vue';
import ProductList from '@/components/ProductList.vue';

import { usePagination } from '@/hooks/usePagination';

import { debounce } from '@/helpers/debounce';

import type { IProduct } from '@/types/product';
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { ISorting } from '@/types/sorting';
import type { IPrices } from '@/types/prices';

const products = ref<IProduct[]>();

const getProducts = async () => {
  const params = {
    colors_like: colorsSelected.value,
    categories_like: categorySelected.value,
    name_like: searchQuery.value,
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 3,
  };

  const { data, pagination: p } = await fetchAllProducts(params);

  products.value = data;
  setPagination(p);
};

const refetchProducts = () => {
  resetCurrentPage();
  getProducts();
};

//Pagination
const { pagination, setPagination, resetCurrentPage, setCurrentPage } = usePagination();

const changePage = (page: number) => {
  setCurrentPage(page);
  getProducts();
};

//Search
const searchQuery = ref('');

const searchProducts = debounce(() => {
  refetchProducts();
}, 300);

//Sorting
const sorting = ref<ISorting>({ target: 'price', order: 'asc' });

//Filters
//Colors
const colorsList = ref<IColor[]>();
const colorsSelected = ref<string[]>([]);

//Category
const route = useRoute();
const categoryFromUrl = route.params.category;

const categoriesList = ref<ICategory[]>();
const categorySelected = ref('');

const router = useRouter();
const goToCategory = () => {
  router.push({ name: 'catalog', params: { category: categorySelected.value } });
  refetchProducts();
};

//Range prices
const prices = ref<IPrices>();

onMounted(async () => {
  if (categoryFromUrl) categorySelected.value = categoryFromUrl;
  getProducts();
  prices.value = await fetchAllPrices();
  categoriesList.value = await fetchAllCategories();
  colorsList.value = await fetchAllColors();
});
</script>

<style scoped lang="scss"></style>
