<template>
  <div>
    <h1>Colors</h1>

    <Dialog
      v-model:visible="isSuccessful"
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
        <h5>Color added Successful!</h5>
      </div>
    </Dialog>

    <div class="color-container">
      <form
        class="form"
        @submit.prevent="handleSubmit(!v$.$invalid)">
        <h2>Add new color</h2>
        <div class="row">
          <div class="input-wrapper">
            <label for="name">Name</label>
            <InputText
              id="name"
              type="text"
              v-model="v$.name.$model" />
          </div>
          <ColorPicker v-model="v$.code.$model" />
        </div>

        <div class="row">
          <small
            v-if="v$.name.$invalid && submitted"
            class="p-error"
            >{{ v$.name.required.$message.replace('Value', 'Name') }}</small
          >

          <small
            v-if="v$.code.$invalid && submitted"
            class="p-error"
            >{{ v$.code.required.$message.replace('Value', 'Color') }}</small
          >
        </div>

        <Button
          class="p-button-lg"
          type="submit"
          >Add</Button
        >
      </form>

      <div class="items">
        <div
          v-for="color in colors"
          :key="color.id"
          class="item-card">
          <div
            class="color"
            :class="color.name"
            :style="{ background: color.code }"></div>
          <strong>{{ color.name }}</strong>
          <p>{{ color.count }} items</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllColors, fetchAllProducts } from '@/api/catalog';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ColorPicker from 'primevue/colorpicker';

import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import type { IColor } from '@/types/color';

import { addColor } from '../api/admin';

interface ICountableColor extends IColor {
  count: number;
}

const colors = ref<ICountableColor[]>();
const submitted = ref(false);

const state = ref({
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
    placeColor();
    resetForm();
    getColors();
  }
};

const rawColors = ref<IColor[]>();

const getColors = async () => {
  rawColors.value = await fetchAllColors();

  colors.value = await Promise.all(
    rawColors.value.map(async (color: IColor) => {
      const count = (await fetchAllProducts({ colors_like: color.id })).data.length;
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
  toggleDialog();
};
const isSuccessful = ref(false);

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const resetForm = () => {
  state.value.name = '';
  state.value.code = '';
  submitted.value = false;
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

.row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
}

.color-container {
  display: flex;
  gap: 50px;
}

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
