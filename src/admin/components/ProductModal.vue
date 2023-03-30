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
        @submit.prevent="emit('handleSubmit', !v$.$invalid)"
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
                  for="name"
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
              <p
                class="characteristic-name"
                :class="{ error: state.categories.length === 0 && submitted }">
                Categories*:
              </p>
              <div class="categories">
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="category">
                  <input
                    type="checkbox"
                    name="category"
                    :value="category.name"
                    v-model="state.categories" />
                  {{ category.label }}
                </label>
              </div>
            </div>

            <div class="characteristic">
              <p
                class="characteristic-name"
                :class="{ error: state.colors.length === 0 && submitted }">
                Potter colors*:
              </p>
              <input
                v-for="color in colors"
                :key="color.id"
                type="checkbox"
                name="color"
                class="color"
                :value="color.name"
                v-model="state.colors"
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
    price: number | null;
    //
    badges: string[];
  };
  ///
  // badges?: IBadge[];
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'closeModal'): void;
  (e: 'handleSubmit', query: any): void;
  (e: 'update:state', query: object): void;
}

const emit = defineEmits<IEmits>();

const state = useVModelWrapper(props, emit, 'state');

const rules = {
  name: { required },
  description: { required },
  price: { required },
  //
  // badges: { required },
};

const v$ = useVuelidate(rules, props.state);
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.error {
  color: red;
}

.category,
.pi-times {
  cursor: pointer;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.form-btn {
  align-self: center;
}

.categories {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 15px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.modal-content {
  display: flex;
}

.characteristic {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.color {
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:hover {
    border: 2px solid $secondary-color;
    opacity: 0.7;
  }
  &:checked {
    border: 2px solid $primary-color;
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
  width: 50%;
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
  background: url('../../../public/images/products/product-30.jpg') center/contain no-repeat;
  flex-shrink: 0;
}
</style>
