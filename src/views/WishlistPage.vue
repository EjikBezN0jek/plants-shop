<template>
  <div class="container">
    <div class="wishlist">
      <h1 class="title">Wishlist</h1>

      <div v-if="wishlistItems.length">
        <div class="product-list-mobile">
          <div
            class="list-item"
            v-for="product in wishlistItems"
            :key="product.wishlistId">
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
              </div>

              <div class="row">
                <p>$ {{ product.price }}</p>
                <router-link
                  v-if="isProductExistInCart(product.wishlistId)"
                  to="/cart"
                  class="btn-link btn-secondary p-button-lg">
                  GO TO CART
                </router-link>

                <Button
                  v-else
                  class="p-button-lg"
                  @click="addToCart(product)"
                  >ADD TO CART</Button
                >
              </div>
            </div>
          </div>
        </div>
        <DataTable
          :value="wishlistItems"
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
                class="btn-link btn-secondary p-button-lg">
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
                @click="removeProduct(slotProps.data)"></Button>
            </template>
          </Column>
        </DataTable>
      </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

import type { ICartItem } from '@/types/cartItem';
import type { IWishlistItem } from '@/types/wishlistItem';

const wishlistItems = ref<IWishlistItem[]>([]);
const cartItems = ref<ICartItem[]>([]);

const addToCart = (product: IWishlistItem) => {
  const formatProduct = {
    cartId: product.wishlistId,
    quantity: 1,
    id: product.id,
    name: product.name,
    color: product.color,
    price: product.price,
    img: product.img,
    totalCost: product.price,
  };
  cartItems.value.push(formatProduct);
  saveCart();
};

const isProductExistInCart = (id: string) => {
  return !!cartItems.value.find(item => item.cartId === id);
};

const removeProduct = (product: IWishlistItem) => {
  wishlistItems.value = wishlistItems.value.filter(item => item.wishlistId !== product.wishlistId);
};

const initWishlist = () => {
  wishlistItems.value = JSON.parse(localStorage.getItem('wishlist') ?? '') ?? [];
};

const saveWishlist = () => {
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value));
};

const initCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart') ?? '') ?? [];
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

watch(wishlistItems, saveWishlist, { deep: true });

onMounted(async () => {
  initWishlist();
  initCart();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.wishlist {
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

.p-button-lg {
  width: 150px;
  height: 40px;
  padding: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  @include sm {
    width: 100px;
    padding: 5px;
  }

  @include md {
    padding: 10px;
    width: 200px;
    font-size: 18px;
  }
}

.p-button.p-button-icon-only {
  height: 40px;
  width: 40px;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:focus) {
  outline: none;
}

::v-deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 5px;
}
</style>
