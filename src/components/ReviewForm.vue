<template>
  <form
    @submit.prevent="emit('handleSubmit')"
    class="review-form">
    <div class="form-rating">
      <strong :class="{ error: newRating === 0 && submitted }">Your rating</strong>
      <Rating
        :cancel="false"
        v-model="ratingSelected" />
    </div>

    <span class="p-float-label form-comment">
      <Textarea
        v-model="commentSelected"
        auto-resize
        rows="2"
        cols="30" />
      <label>Comment review</label>
    </span>
    <Button
      class="p-button-lg"
      type="submit"
      >PLACE REVIEW</Button
    >
  </form>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Rating from 'primevue/rating';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

interface IProps {
  newRating?: number;
  newComment?: string;
  submitted: boolean;
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'handleSubmit'): void;
  (e: 'update:newRating', query: number): void;
  (e: 'update:newComment', query: string): void;
}
const emit = defineEmits<IEmits>();

const ratingSelected = useVModelWrapper(props, emit, 'newRating');
const commentSelected = useVModelWrapper(props, emit, 'newComment');
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.error {
  color: red;
}

.review-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.form-rating {
  display: flex;
  align-items: center;
  gap: 15px;
}

.form-comment {
  width: 100%;
}
.product-btn {
  width: 200px;
  height: 40px;
  padding: 10px;
  font-size: 18px;
  display: block;
  align-self: center;
  @include sm {
    align-self: flex-start;
  }
}

::v-deep(.p-inputtextarea .p-inputtext .p-component .p-inputtextarea-resizable) {
  width: 100%;
}

::v-deep(.p-inputtextarea-resizable) {
  border-bottom: 2px solid $complementary-color;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  width: 100%;

  &:focus {
    border-bottom: 2px solid $primary-color;
  }
}

::v-deep(.p-inputtext:enabled:focus) {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: none;
}
</style>
