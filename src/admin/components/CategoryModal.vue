<template>
  <div class="modal">
    <div class="modal-card">
      <div class="modal-header">
        <h2 v-if="isEditCategory">Edit category</h2>
        <h2 v-else>New category</h2>
        <i
          class="pi pi-times"
          style="font-size: 1.5rem"
          @click="emit('closeModal')"></i>
      </div>

      <form
        class="form"
        @submit.prevent="emit('handleSubmit', !v$.$invalid)">
        <div class="input-wrapper">
          <label for="name">Name</label>
          <InputText
            id="name"
            type="text"
            v-model="v$.name.$model" />
          <small
            v-if="v$.name.$invalid && submitted"
            class="p-error"
            >{{ v$.name.required.$message.replace('Value', 'Name') }}</small
          >
        </div>

        <div class="input-wrapper">
          <label for="label">Label</label>
          <InputText
            id="label"
            type="text"
            v-model="v$.label.$model" />
          <small
            v-if="v$.label.$invalid && submitted"
            class="p-error"
            >{{ v$.label.required.$message.replace('Value', 'Label') }}</small
          >
        </div>

        <div
          class="row"
          v-if="isEditCategory">
          <Button
            type="submit"
            class="form-btn"
            >EDIT CATEGORY</Button
          >

          <Button
            icon="pi pi-ban"
            @click="emit('removeCategory', state.id)" />
        </div>
        <Button
          type="submit"
          class="form-btn"
          v-else
          >ADD NEW CATEGORY</Button
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import { ICategory } from '@/types/category';

interface IProps {
  categories?: ICategory[];
  submitted: boolean;
  state: {
    id: number;
    label: string;
    name: string;
  };
  isEditCategory: boolean;
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'closeModal'): void;
  (e: 'handleSubmit', query: any): void;
  (e: 'removeCategory', query: any): void;
  (e: 'update:state', query: object): void;
}

const emit = defineEmits<IEmits>();

const state = useVModelWrapper(props, emit, 'state');

const rules = {
  name: { required },
  label: { required },
};

const v$ = useVuelidate(rules, props.state);
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
  justify-content: space-between;
}

.input-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}

.pi-times {
  cursor: pointer;
}

.form-btn {
  align-self: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-content {
  display: flex;
  gap: 15px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  width: 100%;
}

.modal {
  display: block;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-card {
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  width: 315px;
  height: 328px;
  transform: translate(-50%, -50%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

::v-deep(.p-inputtext) {
  width: 100%;
}
</style>
