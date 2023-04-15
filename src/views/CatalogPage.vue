<template>
  <div class="container">
    <div class="catalog">
      <p class="title">{{ categorySelectedLabel }} plants</p>
      <p class="products">
        <span>{{ pagination.items }}</span> products
      </p>

      <div class="catalog-container">
        <CatalogFilters
          v-model:colorsSelected="colorsSelected"
          @update:colors-selected="refetchProducts"
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
            <DropdownSorting
              v-model:sorting="sorting"
              @update:sorting="refetchProducts"
              :sort-options="sortOptions?.catalog" />
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
              :product="product"
              :colors-list="colorsList" />
          </div>
          <h2 v-else>No products!</h2>

          <div
            ref="observerItem"
            class="observer" />
          <button
            v-if="isShowScroll"
            class="scroll-up"
            @click="scrollUp">
            <i class="pi pi-angle-up"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import {
  fetchAllProducts,
  fetchAllCategories,
  fetchAllColors,
  fetchAllPrices,
  fetchAllBadges,
  fetchSortOptions,
} from '@/api/catalog';

import CatalogSearch from '@/components/CatalogSearch.vue';
import DropdownSorting from '@/components/DropdownSorting.vue';
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
import type { ISortOptions } from '@/types/sortOptions';

const products = ref<IProduct[]>();
const isLoadMore = ref(false);

const getProducts = async () => {
  const params = {
    colors_like: colorsSelected.value,
    categories_like: categorySelected.value,
    badges_like: badgesSelected.value,
    name_like: searchQuery.value,
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 8,
    price_gte: pricesSelected.value?.min,
    price_lte: pricesSelected.value?.max,
  };

  const { data, pagination: p } = await fetchAllProducts(params);
  setPagination(p);

  isLoadMore.value ? (products.value = [...(products.value ?? []), ...data]) : (products.value = data);
  isLoadMore.value = false;
};

const refetchProducts = () => {
  resetCurrentPage();
  getProducts();
};

//Pagination
const { pagination, setPagination, resetCurrentPage, setCurrentPage } = usePagination();

//ScrollUp
const isShowScroll = ref(false);
const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  isShowScroll.value = false;
};

//Search
const searchQuery = ref('');

const searchProducts = debounce(() => {
  refetchProducts();
}, 300);

//Sorting
const sorting = ref<ISorting>({ target: 'price', order: 'asc', label: 'Price: low to high' });

//Filters
//Colors
const colorsList = ref<IColor[]>();
const colorsSelected = ref<number[]>([]);

//Category

const categoriesList = ref<ICategory[]>();
const categorySelected = ref(0);
const categorySelectedLabel = ref('All');

const findCategoryByName = (name: string) => {
  if (categoriesList.value) return categoriesList.value.find(item => item.name === name);
};

const route = useRoute();
const categoryFromUrl = findCategoryByName(route.params.category)?.name;

const findCategoryById = (id: number) => {
  if (categoriesList.value) return categoriesList.value.find(item => item.id === id);
};

const router = useRouter();
const goToCategory = () => {
  router.push({
    name: 'catalog',
    params: { category: findCategoryById(categorySelected.value)?.name },
  });
  refetchProducts();
  if (categoriesList.value && categorySelected.value !== 0) {
    categorySelectedLabel.value = findCategoryById(categorySelected.value)?.label;
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

//Observer
const observerItem = ref();
const initObserver = () => {
  const options = {
    rootMargin: '0px',
    threshold: 1.0,
  };
  const callback = entries => {
    if (entries[0].isIntersecting && pagination.value.current < pagination.value.last) {
      setCurrentPage((pagination.value.current += 1));
      isLoadMore.value = true;
      isShowScroll.value = true;
      getProducts();
    }
  };
  const observer = new IntersectionObserver(callback, options);
  observer.observe(observerItem.value);
};

const sortOptions = ref<ISortOptions>();

onMounted(async () => {
  if (categoryFromUrl) categorySelected.value = categoryFromUrl;
  prices.value = await fetchAllPrices();
  pricesSelected.value = { min: prices.value.max * 0.0025, max: prices.value.max * 1 };
  getProducts();
  initObserver();
  categoriesList.value = await fetchAllCategories();
  colorsList.value = await fetchAllColors();
  badgesList.value = await fetchAllBadges();
  sortOptions.value = await fetchSortOptions();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.scroll-up {
  @include sm {
    position: fixed;
    bottom: 30px;
    right: 60px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: white;
    border: 2px solid $complementary-color;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    & .pi-angle-up {
      color: $primary-color;
      font-size: 2rem;
    }
  }

  @include md {
    bottom: 30px;
    right: 60px;
  }
}

.observer {
  background: none;
  height: 50px;
  width: 100%;
}

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
  padding: 50px 0 0;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @include sm {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
