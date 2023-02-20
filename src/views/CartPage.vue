<template>
  <div class="cart">
    <h1 class="title">Cart</h1>

    <DataTable
      :value="cartItems"
      v-if="cartItems.length"
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

      <Column header="QUANTITY">
        <template #body="slotProps">
          <div class="quantity">
            <button @click="decrementProductQuantity(slotProps.data.cartId)">-</button>
            <p>{{ slotProps.data.quantity }}</p>
            <button @click="incrementProductQuantity(slotProps.data.cartId)">+</button>
          </div>
        </template>
      </Column>
      <Column header="TOTAL">
        <template #body="slotProps">
          <div class="total">$ {{ slotProps.data.totalCost }}</div>
        </template>
      </Column>
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-times"
            @click="deleteFromCart(slotProps.data.cartId)"></Button>
        </template>
      </Column>
      <template #footer>
        CART TOTAL: <span class="total cart-total">$ {{ allProductsTotalCounter(cartItems) }}</span>
      </template>
    </DataTable>

    <div
      v-else
      class="wrapper">
      <p>Cart is empty</p>
      <router-link
        to="/catalog"
        class="btn-link">
        Go to catalog
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

const cartItems = ref([]);

const itemExist = ref();

const allProductsTotalCounter = (data: ICartItem[]) => {
  const initialValue = 0;
  return data.reduce((acc, item) => acc + item.totalCost, initialValue);
};

const deleteFromCart = (id: string) => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value.filter(item => item.cartId !== id)));
  refreshCart();
};

const refreshCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
};

const incrementProductQuantity = (id: string) => {
  itemExist.value = cartItems.value.find(item => item.cartId === id);
  itemExist.value.quantity += 1;
  recalculationTotal();
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
  refreshCart();
};
const decrementProductQuantity = (id: string) => {
  itemExist.value = cartItems.value.find(item => item.cartId === id);
  if (itemExist.value.quantity > 1) itemExist.value.quantity -= 1;
  recalculationTotal();
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
  if (itemExist.value.quantity === 1) {
    localStorage.setItem('cart', JSON.stringify(cartItems.value.filter(item => item.cartId !== id)));
  }
  refreshCart();
};

const recalculationTotal = () => {
  itemExist.value.totalCost = itemExist.value.price * itemExist.value.quantity;
};

onMounted(async () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.cart {
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

.cart-total {
  font-size: 24px;
}

.total {
  color: $primary-color;
  font-weight: bold;
}
.product {
  display: flex;
  align-items: center;
  gap: 20px;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 20px 0;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 20px 0;
  background: none;
}

::v-deep(.p-button.p-button-icon-only) {
  width: 40px;
  height: 40px;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:focus) {
  outline: none;
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

.quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $image-background-color;
  width: 130px;
  font-weight: bold;
  border-radius: 3px;
  gap: 15px;

  & button {
    height: 40px;
    width: 40px;
    border-radius: 3px;
    color: $secondary-color;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  & p {
    width: 20px;
    text-align: center;
  }
}
.product-image {
  width: 100px;
  height: 100%;
}
</style>
