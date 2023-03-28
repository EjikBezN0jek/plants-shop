<template>
  <div class="modal">
    <div class="modal-card">
      <div class="modal-header">
        <h2>New product</h2>
        <i
          class="pi pi-times"
          style="font-size: 1.5rem"
          @click="emit('closeModal')"></i>
      </div>

      <form
        @submit.prevent="emit('handleSubmit')"
        class="form">
        <div class="modal-content">
          <div class="fake-image" />
          <div class="form-content">
            <div class="input-wrapper">
              <span class="p-float-label">
                <InputText
                  id="name"
                  type="text"
                  v-model="v$.name.$model"
                  :class="{ 'p-invalid': v$.name.$invalid && submitted }" />
                <label
                  for="firstName"
                  :class="{ 'p-error': v$.name.$invalid && submitted }">
                  Name*
                </label>
              </span>
              <small
                v-if="v$.name.$invalid && submitted"
                class="p-error"
                >{{ v$.name.required.$message.replace('Value', 'Name') }}</small
              >
            </div>

            <div class="input-wrapper">
              <span class="p-float-label">
                <Textarea
                  id="description"
                  v-model="v$.description.$model"
                  auto-resize
                  rows="2"
                  cols="30"
                  :class="{ 'p-invalid': v$.description.$invalid && submitted }" />
                <label
                  for="description"
                  :class="{ 'p-error': v$.description.$invalid && submitted }">
                  Description*
                </label>
              </span>
              <small
                v-if="v$.description.$invalid && submitted"
                class="p-error"
                >{{ v$.description.required.$message.replace('Value', 'Description') }}</small
              >
            </div>

            <div class="input-wrapper">
              <span class="p-float-label">
                <InputNumber
                  id="price"
                  type="text"
                  v-model="v$.price.$model"
                  prefix="$"
                  :class="{ 'p-invalid': v$.price.$invalid && submitted }" />
                <label
                  for="price"
                  :class="{ 'p-error': v$.price.$invalid && submitted }">
                  Price*
                </label>
              </span>
              <small
                v-if="v$.price.$invalid && submitted"
                class="p-error"
                >{{ v$.price.required.$message.replace('Value', 'Price') }}</small
              >
            </div>

            <div class="characteristic">
              <p class="characteristic-name">Categories*:</p>
              <div class="categories">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  :class="{ 'p-error': v$.categories.$invalid && submitted }">
                  <input
                    type="checkbox"
                    name="category"
                    :value="category.name"
                    v-model="categoriesSelected"
                    :class="category.name" />
                  {{ category.label }}
                </label>
              </div>
            </div>

            <div class="characteristic">
              <p class="characteristic-name">Potter colors*:</p>
              <input
                v-for="color in colors"
                :key="color.id"
                type="checkbox"
                name="color"
                class="color"
                :value="color.name"
                v-model="colorsSelected"
                :class="color.name" />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          class="form-btn"
          >ADD NEW PRODUCT</Button
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import { IColor } from '@/types/color';
import { ICategory } from '@/types/category';
import { IBadge } from '@/types/badge';

interface IProps {
  colors?: IColor[];
  categories?: ICategory[];
  submitted: boolean;
  state: {
    name: string;
    categories: string[];
    colors: string[];
    description: string;
    price: number;
    //
    badges: string[];
  };
  ///
  badges?: IBadge[];
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'closeModal'): void;
  (e: 'handleSubmit'): void;
  (e: 'update:colorsSelected', query: string[]): void;
  (e: 'update:categoriesSelected', query: string[]): void;
  (e: 'update:badgesSelected', query: string[]): void;
}

const emit = defineEmits<IEmits>();

const colorsSelected = useVModelWrapper(props, emit, 'colorsSelected');
const categoriesSelected = useVModelWrapper(props, emit, 'categoriesSelected');

const rules = {
  name: { required },
  categories: { required },
  colors: { required },
  description: { required },
  price: { required },
  //
  badges: { required },
};

const v$ = useVuelidate(rules, props.state);
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.form-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 50%;
  flex-shrink: 0;
}

.form-btn {
  align-self: center;
}

.categories {
  display: flex;
  align-items: flex-start;
  width: 100%;
  justify-content: space-between;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.modal-content {
  display: flex;
  gap: 50px;
}

.characteristic {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.color {
  &:hover {
    border: 4px solid $secondary-color;
    opacity: 0.7;
  }
  &:checked {
    border: 4px solid $primary-color;
    opacity: 1;
  }
}
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  width: 100%;
}

::v-deep(.p-float-label),
::v-deep(.p-inputtext),
::v-deep(.p-inputnumber) {
  width: 100%;
}
.modal {
  display: block;
  position: fixed;
  z-index: 11111;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-card {
  background-color: #fefefe;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  height: 560px;
  transform: translate(0, 50%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fake-image {
  width: 300px;
  height: 350px;
  background: url('../../../public/images/products/product-30.jpg') center/contain;
}
</style>
