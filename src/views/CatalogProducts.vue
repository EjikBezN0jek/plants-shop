<template>
  <div class="catalog">
    <CatalogSearch
      v-model="searchQuery"
      @update:model-value="searchProducts" />

    <h1>{{ categorySelectedLabel }} plants</h1>

    <div class="container">
      <CatalogFilters
        v-model:colors="colorsSelected"
        @update:colors="refetchProducts"
        v-model:category="categorySelected"
        @update:category="goToCategory"
        :colors-list="colorsList"
        :categories-list="categoriesList"
        :prices="prices"
        v-model:pricesSelected="pricesSelected"
        @update:prices-selected="refetchProducts" />

      <div class="content">
        <div class="sorting">
          <p class="products">
            <span>{{ pagination.items }}</span> products
          </p>
          <CatalogSorting
            v-model="sorting"
            @update:model-value="refetchProducts" />
        </div>

        <ProductList :products="products" />

        <CatalogPagination
          v-if="pagination.last > 1"
          :pagination="pagination"
          @change-page="changePage" />
      </div>
    </div>
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
    _limit: 5,
    price_gte: pricesSelected.value?.min,
    price_lte: pricesSelected.value?.max,
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
const categorySelectedLabel = ref('All');

const router = useRouter();
const goToCategory = () => {
  router.push({ name: 'catalog', params: { category: categorySelected.value } });
  refetchProducts();
  if (categoriesList.value && categorySelected.value) {
    categorySelectedLabel.value = categoriesList.value.find(item => item.name === categorySelected.value).label;
  } else {
    categorySelectedLabel.value = 'All';
  }
};

//Range prices
const prices = ref<IPrices>();
const pricesSelected = ref<IPrices>();

onMounted(async () => {
  if (categoryFromUrl) categorySelected.value = categoryFromUrl;
  prices.value = await fetchAllPrices();
  pricesSelected.value = { min: prices.value.max * 0.0025, max: prices.value.max * 0.75 };
  getProducts();
  categoriesList.value = await fetchAllCategories();
  colorsList.value = await fetchAllColors();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';

.catalog {
  padding: 20px;
}

.container {
  display: flex;
  gap: 50px;
}

.content {
  width: 100%;
}

.sorting {
  display: flex;
  align-items: center;
  gap: 30px;
}

.products {
  font-size: 14px;
  span {
    font-weight: bold;
    color: $primary-color;
  }
}
</style>
