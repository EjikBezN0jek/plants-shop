<template>
  <div class="modal">
    <div class="modal-card">
      <div class="modal-header">
        <h2 v-if="isEditColor">Edit color</h2>
        <h2 v-else>New color</h2>
        <i
          class="pi pi-times"
          style="font-size: 1.5rem"
          @click="emit('closeModal')"></i>
      </div>

      <form
        class="form"
        @submit.prevent="emit('handleSubmit', !v$.$invalid)">
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

        <div
          class="row"
          v-if="isEditColor">
          <Button
            type="submit"
            class="form-btn"
            >EDIT COLOR</Button
          >

          <Button
            icon="pi pi-ban"
            @click="emit('removeColor', state.id)" />
        </div>
        <Button
          type="submit"
          class="form-btn"
          v-else
          >ADD NEW Color</Button
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ColorPicker from 'primevue/colorpicker';

import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import { IColor } from '@/types/color';

interface IProps {
  colors?: IColor[];
  submitted: boolean;
  state: {
    id: number;
    code: string;
    name: string;
  };
  isEditColor: boolean;
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'closeModal'): void;
  (e: 'handleSubmit', query: any): void;
  (e: 'removeColor', query: any): void;
  (e: 'update:state', query: object): void;
}

const emit = defineEmits<IEmits>();

const state = useVModelWrapper(props, emit, 'state');

const rules = {
  name: { required },
  code: { required },
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

.color-container {
  display: flex;
  gap: 50px;
}

::v-deep(.p-colorpicker-panel) {
  z-index: 999999;
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
  height: 240px;
  transform: translate(-50%, -50%);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
