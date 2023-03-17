<template>
  <div class="container user">
    <div class="sidemenu">
      <div
        v-for="item in items"
        :key="item.label"
        class="item-wrapper">
        <div
          class="menu-item"
          :class="{ active: isActiveItem(item.label) }"
          @click="changeContent(item.label)">
          <i
            :class="item.icon"
            style="font-size: 1rem"></i>
          <p>{{ item.label }}</p>
        </div>
      </div>
      <Button
        class="menu-item"
        @click="quitFromAccount">
        <i
          class="pi pi-sign-out"
          style="font-size: 1rem"></i>
        Quit
      </Button>
    </div>

    <Accordion
      :multiple="true"
      v-if="isShowOrders"
      class="content">
      <AccordionTab
        v-for="order in ordersSort()"
        :key="order.id">
        <template #header>
          <div class="accordion-header">
            <div class="accordion-wrapper">
              <p>Order id: {{ order.id }}</p>
              <p class="date">{{ dateFormatter(order.date) }}</p>
            </div>

            <p
              class="order-status"
              :class="order.status.name">
              {{ order.status.label }}
            </p>
          </div>
        </template>

        <StepsWidget
          :order-status-items="orderStatusItems"
          :current-status="order.status.name"></StepsWidget>

        <router-link
          :to="{ name: 'product', params: { id: product.id, name: product.name } }"
          v-for="product in order.cart"
          :key="product.id"
          class="product link">
          <img
            :src="`/images/products/${product.img}`"
            alt="product-img"
            class="product-image product-item" />
          <div class="product-info product-item">
            <p class="product-name">{{ product.name }}</p>
            <div
              class="color"
              :class="product.color"></div>
          </div>

          <p class="product-item">${{ product.price }}</p>
          <p class="product-item">x {{ product.quantity }}</p>
        </router-link>
        <div class="order-info">
          <div class="order-info-wrapper">
            <div class="order-info-item">
              <i class="pi pi-user"></i>
              <div class="wrapper">
                <strong>Customer</strong>
                <p>{{ order.firstName }} {{ order.lastName }}</p>
                <p>{{ order.email }}</p>
                <p>{{ order?.phone }}</p>
              </div>
            </div>
            <div class="order-info-item">
              <i class="pi pi-map-marker"></i>
              <div class="wrapper">
                <strong>Address</strong>
                <p class="address">{{ order.country }}, {{ order.city }}, {{ order.address }}</p>
              </div>
            </div>
          </div>
          <div class="order-info-wrapper">
            <div class="order-info-item">
              <i class="pi pi-credit-card"></i>
              <p>{{ order.payment.label }}</p>
            </div>
            <div class="order-info-item">
              <strong>Subtotal</strong>
              <p class="subtotal">${{ order.productsTotal }}</p>
            </div>
            <div class="order-info-item">
              <strong>Shipping</strong>
              <p>${{ order.shippingCost }}</p>
            </div>
            <div class="order-info-item">
              <strong>Total</strong>
              <p>${{ order.totalCost }}</p>
            </div>
          </div>
        </div>
      </AccordionTab>
    </Accordion>

    <div
      v-if="isShowReviews"
      class="content">
      <div class="reviews-list">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="review">
          <router-link :to="{ name: 'product', params: { id: review.productId, name: review.productName } }">
            <img
              :src="`/images/products/${review.productImage}`"
              alt="product-img"
              class="product-image" />
          </router-link>

          <div class="review-info">
            <small
              v-if="review.isModerate"
              class="review-status"
              >Published <i class="pi pi-check"></i
            ></small>
            <div class="review-header">
              <p class="review-name">
                <strong>{{ review.productName }}</strong> <small>{{ dateFormatter(review.date) }}</small>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Rating from 'primevue/rating';

import StepsWidget from '@/components/StepsWidget.vue';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

import { dateFormatter } from '@/helpers/dateFormatter';

import type { IOrder } from '@/types/order';
import type { IOrderStatus } from '@/types/orderStatus';
import type { IReview } from '@/types/review';

import { fetchUserOrders, fetchAllOrderStatus, fetchUserReviews } from '@/api/user';

const orders = ref<IOrder[]>();
const orderStatusItems = ref<IOrderStatus[]>();

const reviews = ref<IReview[]>();

const user = useInject(UserKey);

const items = [
  { label: 'My orders', icon: 'pi pi-fw pi-shopping-bag' },
  { label: 'My reviews', icon: 'pi pi-fw pi-star-fill' },
];

const ordersSort = () => {
  return orders.value?.sort((a, b) => b.date - a.date);
};

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push('/');
};
const isShowOrders = ref(true);
const isShowReviews = ref(false);
const menuItemSelected = ref('My orders');

const isActiveItem = (item = '') => {
  return item === menuItemSelected.value;
};

const changeContent = (content: string) => {
  menuItemSelected.value = content;
  if (content === 'My orders') {
    isShowOrders.value = true;
    isShowReviews.value = false;
  }
  if (content === 'My reviews') {
    isShowOrders.value = false;
    isShowReviews.value = true;
  }
};

onMounted(async () => {
  if (user.value) {
    orders.value = await fetchUserOrders(user.value);
    reviews.value = await fetchUserReviews(user.value);
  }
  orderStatusItems.value = await fetchAllOrderStatus();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.review-status {
  text-align: left;
  & .pi-check {
    color: $primary-color;
  }
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

.user {
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  gap: 50px;

  @include sm {
    flex-direction: row;
    padding: 20px;
    gap: 20px;
    justify-content: space-between;
  }
}

.sidemenu {
  display: flex;
  flex-direction: column;
  gap: 15px;

  @include sm {
    width: 33.3%;
  }
  @include md {
    width: 25%;
  }
}

.menu-item {
  color: $secondary-color;
  text-decoration: none;
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 18px;
  border-bottom: 2px solid $complementary-color;
  cursor: pointer;

  & p {
    flex-shrink: 0;
  }

  &:hover {
    background: $image-background-color;
    border-radius: 3px;
    color: $secondary-color;
    border-bottom: 2px solid $complementary-color;
  }

  &.active {
    background: none;
    border-radius: 0;
    border-bottom: 2px solid $primary-color;
  }
}

.content {
  width: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.address {
  text-align: left;
  width: auto;
}

.product {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  justify-content: space-between;
}

.product-item {
  width: 25%;
}

.color {
  flex-shrink: 0;
}

.order-info {
  background: $image-background-color;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @include sm {
    align-items: flex-start;
    flex-direction: row;
    gap: 50px;
    justify-content: center;
  }
}

.order-info-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-info-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  & .pi {
    font-size: 1.5rem;
  }
}

::v-deep(.p-accordion.p-component) {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

::v-deep(.p-accordion .p-accordion-content) {
  padding: 1rem 0 0;
}
::v-deep(.p-accordion .p-accordion-tab .p-accordion-header .p-accordion-header-link),
::v-deep(.p-accordion .p-accordion-tab:last-child .p-accordion-header:not(.p-highlight) .p-accordion-header-link) {
  border-radius: 10px;
  border: 1px solid $complementary-color;
  display: flex;
  gap: 10px;
}
::v-deep(.p-accordion .p-accordion-tab-active .p-accordion-header .p-accordion-header-link) {
  border-radius: 10px 10px 0 0;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 10px;
}

.accordion-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.orders {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.order {
  border-radius: 10px;
  border: 1px solid $complementary-color;
}

.order-status {
  flex-shrink: 0;

  &.pending {
    color: rgb(94, 148, 211);
  }
  &.ready-to-ship {
    color: rgb(211, 211, 94);
  }
  &.on-the-way {
    color: rgb(211, 150, 94);
  }
  &.delivered {
    color: $primary-color;
  }
}
.order-header {
  background: $image-background-color;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-radius: 10px 10px 0 0;
}

.header-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.total {
  font-weight: bold;
  color: $primary-color;
  font-size: 22px;
}

.date {
  font-size: 12px;
}

.product {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-between;
}

.product-name {
  text-align: left;
  flex-shrink: 1;
}

.product-image {
  width: 100px;
  height: 100%;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  @include sm {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 25%;
  }
}

.quit-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: flex-end;
}
</style>
