<template>
  <div class="container">
    <div class="cart">
      <h1 class="title">Cart</h1>

      <div v-if="cartItems.length">
        <div class="product-list-mobile">
          <div
            class="list-item"
            v-for="product in cartItems"
            :key="product.cartId">
            <router-link
              :to="{ name: 'product', params: { id: product.id, name: product.name } }"
              class="product">
              <img
                :src="`/images/products/${product.img}`"
                alt="product-img"
                class="product-image" />
            </router-link>

            <div class="rows">
              <div class="row">
                <p class="product-name">{{ product.name }}</p>
                <Button
                  icon="pi pi-times"
                  @click="removeProduct(product)"></Button>
              </div>

              <div class="row">
                <div
                  class="color"
                  :class="product.color"></div>
                <div class="quantity">
                  <button @click="decrementProductQuantity(product)">-</button>
                  <p>{{ product.quantity }}</p>
                  <button @click="incrementProductQuantity(product)">+</button>
                </div>
              </div>

              <div class="row">
                <p>$ {{ product.price }}</p>
                <p>
                  Total: <span class="total">$ {{ product.totalCost }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <p>
              CART TOTAL: <span class="total cart-total">$ {{ allProductsTotalCounter(cartItems) }}</span>
            </p>
            <router-link
              :to="{ name: 'checkout' }"
              class="btn-link"
              >Proceed to checkout</router-link
            >
          </div>
        </div>

        <DataTable
          :value="cartItems"
          responsive-layout="scroll"
          class="table">
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
                :class="findColor(slotProps.data)?.name"
                :style="{ background: findColor(slotProps.data)?.code }"></div>
            </template>
          </Column>
          <Column header="PRICE">
            <template #body="slotProps"> $ {{ slotProps.data.price }} </template>
          </Column>

          <Column header="QUANTITY">
            <template #body="slotProps">
              <div class="quantity">
                <button @click="decrementProductQuantity(slotProps.data)">-</button>
                <p>{{ slotProps.data.quantity }}</p>
                <button @click="incrementProductQuantity(slotProps.data)">+</button>
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
                @click="removeProduct(slotProps.data)"></Button>
            </template>
          </Column>
          <template #footer>
            <p>
              CART TOTAL: <span class="total cart-total">$ {{ allProductsTotalCounter(cartItems) }}</span>
            </p>
            <Button
              class="btn-link"
              @click="proceedToCheckout"
              >Proceed to checkout</Button
            >
          </template>
        </DataTable>
      </div>

      <div
        v-else
        class="wrapper">
        <p>Cart is empty</p>
        <router-link
          to="/catalog"
          class="btn-link">
          GO TO CATALOG
        </router-link>
      </div>
    </div>
    <AuthModal
      v-if="isShowAuth"
      @hide="toggleAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

import AuthModal from '@/components/AuthModal.vue';

import type { ICartItem } from '@/types/cartItem';
import type { IColor } from '@/types/color';

import { UserKey, CartItemsQuantityKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';
import router from '@/router';
import { fetchAllColors } from '@/api/catalog';

const cartItemsQuantity = useInject(CartItemsQuantityKey);
const cartItems = ref<ICartItem[]>([]);
const colorsList = ref<IColor[]>([]);

const findColor = (cartItem: ICartItem) => {
  return colorsList.value.find(color => cartItem.color === color.id);
};

const isShowAuth = ref(false);
const toggleAuthModal = () => (isShowAuth.value = !isShowAuth.value);

const allProductsTotalCounter = (products: ICartItem[]) => {
  return products.reduce((acc, item) => acc + item.totalCost, 0);
};

const recalculationTotal = (product: ICartItem) => {
  product.totalCost = product.price * product.quantity;
};

const incrementProductQuantity = (product: ICartItem) => {
  product.quantity += 1;
  recalculationTotal(product);
};

const decrementProductQuantity = (product: ICartItem) => {
  product.quantity -= 1;
  recalculationTotal(product);
  if (product.quantity < 1) removeProduct(product);
};

const removeProduct = (product: ICartItem) => {
  cartItems.value = cartItems.value.filter(item => item.cartId !== product.cartId);
};

const initCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart') ?? '') ?? [];
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
};

const user = useInject(UserKey);

const proceedToCheckout = () => {
  if (user.value?.name) {
    router.push('checkout');
  } else {
    isShowAuth.value = true;
  }
};

watch(cartItems, saveCart, { deep: true });

onMounted(async () => {
  initCart();
  colorsList.value = await fetchAllColors();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.cart {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 0;
}

.product-list-mobile {
  @include sm {
    display: none;
  }
}

.list-item {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid $complementary-color;
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

.product-name {
  text-align: left;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  & p {
    flex-shrink: 0;
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

.total {
  color: $primary-color;
  font-weight: bold;
}

.cart-footer {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
  border-width: 0 0 1px 0;
  padding: 1rem 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.cart-total {
  font-size: 24px;
}

.table {
  display: none;
  @include sm {
    display: block;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

::v-deep(.p-datatable-footer) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
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
</style>
