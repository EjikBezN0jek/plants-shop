<template>
  <div class="search">
    <label>
      <input
        v-model.trim="search"
        type="text"
        placeholder="Search..."
        class="search" />
      <button @click="clearInput">Clear</button>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { useVModelWrapper } from '@/hooks/useVModelWrapper';

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

<style lang="scss" scoped></style>
