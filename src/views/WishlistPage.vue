<template>
  <div class="wishlist">
    <h1 class="title">Wishlist</h1>
    <DataTable
      :value="wishlistItems"
      v-if="wishlistItems.length"
      responsiveLayout="scroll">
      <Column header="PRODUCT NAME">
        <template #body="slotProps">
          <router-link
            :to="{ name: 'product', params: { id: slotProps.data.id, name: slotProps.data.name } }"
            class="product">
            <img
              :src="`/images/products/${slotProps.data.img}`"
              alt="product-img"
              class="product-image" />
            <p>{{ slotProps.data.name }}</p>
          </router-link>
        </template>
      </Column>

      <Column header="POTTER COLOR">
        <template #body="slotProps">
          <div
            class="color"
            :class="slotProps.data.color"></div>
        </template>
      </Column>
      <Column header="PRICE">
        <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
      </Column>

      <Column>
        <template #body="slotProps">
          <router-link
            v-if="isProductExistInCart(slotProps.data.wishlistId)"
            to="/cart"
            class="btn-link btn-secondary">
            GO TO CART
          </router-link>

          <Button
            v-else
            class="p-button-lg"
            @click="addToCart(slotProps.data)"
            >ADD TO CART</Button
          >
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-times"
            @click="deleteFromWishlist(slotProps.data.wishlistId)"></Button>
        </template>
      </Column>
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
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value.filter(item => item.wishlistId !== id)));
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
  refreshWishlist();
};

const isProductExistInCart = (id: string) => {
  if (cartItems.value.find(item => item.cartId === id)) return true;
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

.wishlist {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.product {
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  cursor: pointer;
  color: $table-text-color;
}
.product-image {
  width: 100px;
  height: 100%;
}

.p-button-lg {
  width: 200px;
  height: 40px;
  padding: 10px;
  font-size: 18px;
  display: block;
}

.btn-secondary {
  font-size: 18px;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:focus) {
  outline: none;
}
</style>
