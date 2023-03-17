<template>
  <div class="reviews">
    <h3>Reviews ({{ moderatedReviews.length }})</h3>
    <div class="reviews-list">
      <div
        v-for="review in moderatedReviews"
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
  </div>
</template>

<script setup lang="ts">
import Rating from 'primevue/rating';

import type { IReview } from '@/types/review';

import { dateFormatter } from '@/helpers/dateFormatter';

interface IProps {
  moderatedReviews: IReview[];
}
const props = defineProps<IProps>();
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
