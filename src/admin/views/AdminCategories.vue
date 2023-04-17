<template>
  <div>
    <h1>Categories</h1>

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
        <h5>Category Successful!</h5>
      </div>
    </Dialog>

    <CategoryModal
      v-if="isModalOpen"
      @close-modal="closeModal"
      :categories="categories"
      v-model:state="state"
      :submitted="submitted"
      :is-edit-category="isEditCategory"
      @handle-submit="handleSubmit"
      @remove-category="removeHandler" />
    <div class="category-container">
      <Button
        @click="openModal"
        class="category-btn"
        >ADD NEW CATEGORY</Button
      >
      <div class="items">
        <div
          v-for="category in categories"
          :key="category.id"
          class="item-card"
          @click="editCategory(category)">
          <i
            class="pi pi-tag"
            :style="{ fontSize: '3rem', color: 'var(--green-500)' }"></i>
          <strong>{{ category.label }}</strong>
          <p>{{ category.count }} items</p>
        </div>
      </div>
    </div>

    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllCategories, fetchAllProducts } from '@/api/catalog';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import CategoryModal from '@/admin/components/CategoryModal.vue';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import { addCategory, addEditingCategory, removeCategory, addEditingProduct } from '../api/admin';

import type { ICategory } from '@/types/category';
import type { IProduct } from '@/types/product';

interface ICountableCategory extends ICategory {
  count: number;
}

const confirm = useConfirm();
const toast = useToast();

const submitted = ref(false);
const isModalOpen = ref(false);
const body = document.querySelector('body');
const isSuccessful = ref(false);
const isEditCategory = ref(false);

const state = ref({
  id: 0,
  name: '',
  label: '',
});

const categories = ref<ICountableCategory[]>();

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const cleanForm = () => {
  state.value.name = '';
  state.value.label = '';
  submitted.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
  body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditCategory.value = false;
  body.style.overflow = 'auto';
  cleanForm();
  getCategories();
};

const editCategory = (category: ICategory) => {
  isEditCategory.value = true;
  openModal();
  state.value.id = category.id;
  state.value.name = category.name;
  state.value.label = category.label;
};

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (isEditCategory.value) {
      placeEditingCategory();
    } else {
      placeCategory();
    }
    closeModal();
    toggleDialog();
  }
};

const placeCategory = async () => {
  const newCategory = {
    name: state.value.name,
    label: state.value.label,
  };
  addCategory(newCategory);
};

const placeEditingCategory = () => {
  const editingCategory = {
    id: state.value.id,
    name: state.value.name,
    label: state.value.label,
  };
  addEditingCategory(editingCategory);
};

const editingProductCategories = ref<number[]>();
const productId = ref(0);

const placeEditingProduct = async () => {
  const newProduct = {
    id: productId.value,
    categories: editingProductCategories.value,
  };
  addEditingProduct(newProduct);
};

const allProducts = ref<IProduct[]>();

const removeHandler = (id: number) => {
  confirm.require({
    message: 'Do you want to delete this category?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      allProducts.value = (await fetchAllProducts({ categories_like: id })).data;
      allProducts.value.forEach(item => {
        editingProductCategories.value = item.categories.filter(category => category !== id);
        productId.value = item.id;
        placeEditingProduct();
      });
      removeCategory(id);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Category deleted', life: 3000 });
      closeModal();
      getCategories();
    },
  });
};

const getCategories = async () => {
  const rawCategories = await fetchAllCategories();

  categories.value = await Promise.all(
    rawCategories.map(async (category: ICategory) => {
      const count = (await fetchAllProducts({ categories_like: category.id })).data.length;
      return { ...category, count };
    })
  );
};

onMounted(async () => {
  getCategories();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.item-card {
  cursor: pointer;
}

.category-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-btn {
  align-self: center;
}
</style>
