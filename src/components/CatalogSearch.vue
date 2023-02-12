<template>
  <div class="search">
    <span class="p-input-icon-left p-input-icon-right">
      <i class="pi pi-search" />
      <InputText
        type="text"
        v-model.trim="search"
        placeholder="Search" />
      <i
        class="pi pi-times clear"
        @click="clearInput" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import InputText from 'primevue/inputtext';

interface IProps {
  modelValue: string;
}

const props = defineProps<IProps>();

interface IEmits {
  (e: 'update:modelValue', query: string): void;
}
const emit = defineEmits<IEmits>();

const search = useVModelWrapper(props, emit);

const clearInput = () => {
  search.value = '';
};
</script>

<style lang="scss" scoped>
.clear {
  cursor: pointer;
}
</style>
