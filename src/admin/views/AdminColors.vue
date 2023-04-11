<template>
  <div>
    <h1>Colors</h1>

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
        <h5>Color Successful!</h5>
      </div>
    </Dialog>

    <ColorModal
      v-if="isModalOpen"
      @close-modal="closeModal"
      :colors="colors"
      v-model:state="state"
      :submitted="submitted"
      :is-edit-color="isEditColor"
      @handle-submit="handleSubmit"
      @remove-color="removeHandler" />

    <div class="color-container">
      <Button @click="openModal">ADD NEW COLOR</Button>
      <div class="items">
        <div
          v-for="color in colors"
          :key="color.id"
          class="item-card"
          @click="editColor(color)">
          <div
            class="color"
            :class="color.name"
            :style="{ background: color.code }"></div>
          <strong>{{ color.name }}</strong>
          <p>{{ color.count }} items</p>
        </div>
      </div>
    </div>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllColors, fetchAllProducts } from '@/api/catalog';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import ColorModal from '@/admin/components/ColorModal.vue';

import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IColor } from '@/types/color';
import type { IProduct } from '@/types/product';

import { addColor, addEditingColor, removeColor, addEditingProduct } from '../api/admin';

interface ICountableColor extends IColor {
  count: number;
}

const confirm = useConfirm();
const toast = useToast();

const colors = ref<ICountableColor[]>();
const submitted = ref(false);

const state = ref({
  id: null,
  name: '',
  code: '',
});

const rules = {
  name: { required },
  code: { required },
};
const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (isEditColor.value) {
      placeEditingColor();
    } else {
      placeColor();
    }
    closeModal();
    toggleDialog();
  }
};

const rawColors = ref<IColor[]>();
const allProducts = ref<IProduct[]>();

const getColors = async () => {
  rawColors.value = await fetchAllColors();

  colors.value = await Promise.all(
    rawColors.value.map(async (color: IColor) => {
      allProducts.value = (await fetchAllProducts({ colors_like: color.id })).data;
      const count = allProducts.value.length;
      return { ...color, count };
    })
  );
};

const placeColor = async () => {
  const newColor = {
    name: state.value.name,
    code: '#' + state.value.code,
  };
  addColor(newColor);
};
const isSuccessful = ref(false);

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const cleanForm = () => {
  state.value.name = '';
  state.value.code = '';
  submitted.value = false;
};

const isModalOpen = ref(false);
const body = document.querySelector('body');

const openModal = () => {
  isModalOpen.value = true;
  body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditColor.value = false;
  body.style.overflow = 'auto';
  cleanForm();
  getColors();
};

const isEditColor = ref(false);

const editColor = (color: IColor) => {
  isEditColor.value = true;
  openModal(color);
  state.value.id = color.id;
  state.value.name = color.name;
  state.value.code = color.code.replace(/#/g, '');
};

const placeEditingColor = () => {
  const editingColor = {
    id: state.value.id,
    name: state.value.name,
    code: '#' + state.value.code,
  };
  addEditingColor(editingColor);
};
const editingProductColors = ref<number[]>();
const productId = ref(0);

const placeEditingProduct = async () => {
  const newProduct = {
    id: productId.value,
    colors: editingProductColors.value,
  };
  addEditingProduct(newProduct);
};

const removeHandler = (id: number) => {
  confirm.require({
    message: 'Do you want to delete this color?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      allProducts.value = (await fetchAllProducts({ colors_like: id })).data;
      allProducts.value.forEachl(item => {
        editingProductColors.value = item.colors.filter(color => color !== id);
        productId.value = item.id;
        placeEditingProduct();
      });
      removeColor(id);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Color deleted', life: 3000 });
      closeModal();
      getColors();
    },
  });
};

onMounted(async () => {
  getColors();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.items {
  flex-wrap: wrap;
}

.item-card {
  cursor: pointer;
}

.row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
}

// .color-container {
//   display: flex;
//   gap: 50px;
// }

::v-deep(.p-colorpicker-preview) {
  height: 36px;
  width: 36px;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 10px;
  border: 1px solid $complementary-color;
  padding: 20px;
  height: 100%;
}

.color {
  &.white {
    border: 1px solid $complementary-color;
  }
}
</style>
