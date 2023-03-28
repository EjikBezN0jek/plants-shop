<template>
  <div class="reviews">
    <h3>Reviews ({{ reviewsAllCount }})</h3>

    <DropdownSorting
      :sort-options="sortOptions"
      v-model:sorting="sorting"
      v-if="reviews.length" />

    <div class="reviews-list">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="review">
        <div class="avatar">
          <p>{{ review.userName[0] }}</p>
        </div>
        <div class="review-info">
          <div class="review-header">
            <p class="review-name">
              <strong>{{ review.userName }}</strong> <small>{{ dateFormatter(review.date) }}</small>
            </p>

            <Rating
              :readonly="true"
              :cancel="false"
              :model-value="review.rating" />
          </div>

          <p class="review-comment">{{ review.comment }}</p>
        </div>
      </div>
    </div>

    <ClassicPagination
      :pagination="pagination"
      @change-page="emit('changePage', $event)"
      v-if="reviews.length" />
  </div>
</template>

<script setup lang="ts">
import Rating from 'primevue/rating';

import { useVModelWrapper } from '@/hooks/useVModelWrapper';

import DropdownSorting from '@/components/DropdownSorting.vue';
import ClassicPagination from '@/components/ClassicPagination.vue';

import type { IReview } from '@/types/review';
import type { IPagination } from '@/types/';
import type { ISorting } from '@/types/sorting';

import { dateFormatter } from '@/helpers/dateFormatter';

interface IProps {
  reviews: IReview[];
  reviewsAllCount: number;
  pagination: IPagination;
  sorting: ISorting;
  sortOptions?: ISorting[];
}
const props = defineProps<IProps>();

interface IEmits {
  (e: 'changePage', page: number): void;
  (e: 'update:sorting', sorting: ISorting): void;
}
const emit = defineEmits<IEmits>();

const sorting = useVModelWrapper(props, emit, 'sorting');
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.avatar {
  width: 50px;
  height: 50px;
  background: $image-background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.review {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid $image-background-color;
}

.review-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  flex-wrap: wrap;

  @include sm {
    flex-wrap: nowrap;
    gap: 20px;
  }
}

.review-name {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 100%;
  & small {
    font-size: 12px;
    font-style: italic;
  }

  @include sm {
    gap: 20px;
    width: auto;
  }
}

.review-comment {
  text-align: left;
}
</style>
