<template>
  <div>
    <h1>Categories</h1>
    <div class="items">
      <div
        v-for="category in categories"
        :key="category.id"
        class="item-card">
        <i
          class="pi pi-tag"
          :style="{ fontSize: '3rem', color: 'var(--green-500)' }"></i>
        <strong>{{ category.label }}</strong>
        <p>{{ category.count }} items</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllCategories, fetchAllProducts } from '@/api/catalog';

import type { ICategory } from '@/types/category';

interface ICountableCategory extends ICategory {
  count: number;
}

const categories = ref<ICountableCategory[]>();

onMounted(async () => {
  const rawCategories = await fetchAllCategories();

  categories.value = await Promise.all(
    rawCategories.map(async (category: ICategory) => {
      const count = (await fetchAllProducts({ categories_like: category.name })).data.length;
      return { ...category, count };
    })
  );
});
</script>

<style scoped lang="scss"></style>
