<template>
  <Dialog
    v-model:visible="showSuccessful"
    @hide="emit('hide')"
    :breakpoints="{ '960px': '80vw' }"
    :style="{ width: '30vw' }"
    :modal="true"
    :dismissable-mask="true">
    <template #header>
      <h3>Successful</h3>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';

const showSuccessful = ref(true);
// interface IProps {
//   isSuccessful: boolean;
// }

// const props = defineProps<IProps>();

interface IEmits {
  (e: 'hide'): void;
}
const emit = defineEmits<IEmits>();

// const showSuccessful = useVModelWrapper(props, emit, 'isSuccessful');
</script>

<style scoped></style>
