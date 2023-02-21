<template>
  <div>
    <h1 class="title">Wishlist</h1>
    <DataTable
      :value="wishlistItems"
      v-if="wishlistItems.length"
      responsiveLayout="scroll">
      <Column header="PRODUCT NAME">
        <template #body="slotProps">
          <div class="product">
            <img
              :src="`/images/products/${slotProps.data.img}`"
              alt="product-img"
              class="product-image" />
            <p>{{ slotProps.data.name }}</p>
          </div>
        </template>
      </Column>

      <Column header="POTTER COLOR">
        <template #body="slotProps">
          <div
            class="select-color"
            :class="slotProps.data.color"></div>
        </template>
      </Column>
      <Column header="PRICE">
        <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
      </Column>

      <!-- <Column header="QUANTITY">
        <template #body="slotProps">
          <div class="quantity">
            <button @click="decrementProductQuantity(slotProps.data.cartId)">-</button>
            <p>{{ slotProps.data.quantity }}</p>
            <button @click="incrementProductQuantity(slotProps.data.cartId)">+</button>
          </div>
        </template>
      </Column> -->
      <!-- <Column header="TOTAL">
        <template #body="slotProps">
          <div class="total">$ {{ slotProps.data.totalCost }}</div>
        </template>
      </Column> -->

      <Column>
        <template #body="slotProps">
          <router-link
            v-if="itemExistInCart"
            to="/cart"
            class="btn-link btn-secondary">
            GO TO CART
          </router-link>

          <Button
            v-else
            @click="addToCart(slotProps.data)"
            >ADD TO CART</Button
          >
          <!-- <Button @click="addToCart(slotProps.data)">ADD TO CART</Button> -->
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-times"
            @click="deleteFromWishlist(slotProps.data.wishlistId)"></Button>
        </template>
      </Column>
      <!-- <template #footer>
        CART TOTAL: <span class="total cart-total">$ {{ allProductsTotalCounter(cartItems) }}</span>
      </template> -->
    </DataTable>

    <div
      v-else
      class="wrapper">
      <p>Wishlist is empty</p>
      <router-link
        to="/catalog"
        class="btn-link">
        GO TO CATALOG
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

import type { ICartItem } from '@/types/cartItem';

const wishlistItems = ref([]);
const cartItems = ref([]);
const itemExistInCart = ref();

const deleteFromWishlist = (id: string) => {
  localStorage.setItem('cart', JSON.stringify(wishlistItems.value.filter(item => item.wishlistId !== id)));
  refreshWishlist();
};

const addToCart = (data: ICartItem) => {
  const formatProduct = {
    cartId: data.wishlistId,
    quantity: 1,
    id: data.id,
    name: data.name,
    color: data.color,
    price: data.price,
    img: data.img,
    totalCost: data.price,
  };
  cartItems.value.push(formatProduct);
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
  productExistInCart(data.wishlistId);
};

const productExistInCart = (id: string) => {
  itemExistInCart.value = cartItems.value.find(item => item.cartId === id);
};

const refreshWishlist = () => {
  wishlistItems.value = JSON.parse(localStorage.getItem('wishlist')) || [];
};

onMounted(async () => {
  refreshWishlist();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.product {
  display: flex;
  align-items: center;
  gap: 20px;
}
.product-image {
  width: 100px;
  height: 100%;
}

.select-color {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 40px;
  height: 40px;
  margin: 0;
  border-radius: 50%;
  border: 4px solid $image-background-color;
  &.red {
    background: red;
  }
  &.white {
    background: white;
    border: 1px solid $complementary-color;
  }
  &.black {
    background: black;
  }
  &.gray {
    background: gray;
  }
}
</style>
