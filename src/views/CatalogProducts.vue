<template>
  <div class="catalog">
    <p class="title">{{ categorySelectedLabel }} plants</p>
    <p class="products">
      <span>{{ pagination.items }}</span> products
    </p>

    <div class="catalog-container">
      <CatalogFilters
        v-model:colors="colorsSelected"
        @update:colors="refetchProducts"
        v-model:category="categorySelected"
        @update:category="goToCategory"
        :colors-list="colorsList"
        :categories-list="categoriesList"
        :prices="prices"
        v-model:pricesSelected="pricesSelected"
        @update:prices-selected="refetchProducts"
        :badges-list="badgesList"
        v-model:badges="badgesSelected"
        @update:badges="refetchProducts" />

      <div class="content">
        <div class="row">
          <CatalogSorting
            v-model="sorting"
            @update:model-value="refetchProducts" />
          <CatalogSearch
            v-model="searchQuery"
            @update:model-value="searchProducts" />
        </div>

        <div
          v-if="products?.length"
          class="product-list">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product" />
        </div>
        <h2 v-else>No products!</h2>

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

import { fetchAllProducts, fetchAllCategories, fetchAllColors, fetchAllPrices, fetchAllBadges } from '@/api/catalog';

import CatalogPagination from '@/components/CatalogPagination.vue';
import CatalogSearch from '@/components/CatalogSearch.vue';
import CatalogSorting from '@/components/CatalogSorting.vue';
import CatalogFilters from '@/components/CatalogFilters.vue';
import ProductCard from '@/components/ProductCard.vue';

import { usePagination } from '@/hooks/usePagination';

import { debounce } from '@/helpers/debounce';

import type { IProduct } from '@/types/product';
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { ISorting } from '@/types/sorting';
import type { IPrices } from '@/types/prices';
import type { IBadge } from '@/types/badge';

const products = ref<IProduct[]>();

const getProducts = async () => {
  const params = {
    colors_like: colorsSelected.value,
    categories_like: categorySelected.value,
    badges_like: badgesSelected.value,
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
  document.documentElement.scrollTop = 0;
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

//Badges
const badgesList = ref<IBadge[]>();
const badgesSelected = ref<string[]>([]);

onMounted(async () => {
  if (categoryFromUrl) categorySelected.value = categoryFromUrl;
  prices.value = await fetchAllPrices();
  pricesSelected.value = { min: prices.value.max * 0.0025, max: prices.value.max * 1 };
  getProducts();
  categoriesList.value = await fetchAllCategories();
  colorsList.value = await fetchAllColors();
  badgesList.value = await fetchAllBadges();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.catalog {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 0;
}

.catalog-container {
  @include sm {
    display: flex;
    gap: 50px;
  }
}

.content {
  width: 100%;
  padding: 15px 0;
  @include sm {
    padding: 0;
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;

  @include md {
    justify-content: space-between;
  }
}

.products {
  span {
    font-weight: bold;
    color: $primary-color;
  }
}

.product-list {
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @include sm {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
