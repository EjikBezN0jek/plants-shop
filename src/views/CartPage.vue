<template>
  <div>
    <h1 class="title">Cart</h1>

    <DataTable
      :value="cartItems"
      responsiveLayout="scroll">
      <Column
        field="name"
        header="Name"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            :src="`/images/products/${slotProps.data.img}`"
            alt="product-img"
            class="product-image" />
        </template>
      </Column>
      <Column header="Price">
        <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
      </Column>
      <Column header="Color">
        <template #body="slotProps">
          <div
            class="select-color"
            :class="slotProps.data.color"></div>
        </template>
      </Column>

      <Column header="Quantity">
        <template #body="slotProps">
          <div class="quantity">
            <button @click="decrementProductQuantity">-</button>
            <div>{{ slotProps.data.quantity }}</div>
            <button @click="incrementProductQuantity">+</button>
          </div>
        </template>
      </Column>
      <template #footer>
        Total: {{ cartItems ? cartItems.length : 0 }} product<span v-if="cartItems.length > 1">s</span>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const cartItems = ref([]);

const itemExist = ref();

// const productExist = () => {
//   itemExist.value = cartItems.value.find(item => item.cartId === cartId.value);
// };

// const incrementProductQuantity = () => {
//   itemExist.value.quantity += 1;
//   localStorage.setItem('cart', JSON.stringify(cartItems.value));
//   refreshCart();
// };
// const decrementProductQuantity = () => {
//   if (itemExist.value.quantity > 1) itemExist.value.quantity -= 1;
//   localStorage.setItem('cart', JSON.stringify(cartItems.value));
//   if (itemExist.value.quantity === 1) {
//     localStorage.setItem('cart', JSON.stringify(cartItems.value.filter(item => item.cartId !== cartId.value)));
//   }
//   refreshCart();
// };
// const refreshCart = () => {
//   cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
//   productExist();
// };

onMounted(async () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

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

.quantity {
  display: flex;
  align-items: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 24px;
  gap: 15px;

  & button {
    height: 45px;
    padding: 0.532rem 1.25rem;
    border-radius: 3px;
    color: #ffffff;
    font-size: 24px;
    background: $primary-color;
    border: none;
  }
}
.product-image {
  width: 100px;
  height: 100%;
}
</style>
