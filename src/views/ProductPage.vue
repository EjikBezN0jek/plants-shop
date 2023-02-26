<template>
  <div
    v-if="product"
    class="product">
    <img
      :src="`/images/products/${product.img}`"
      alt="product-image"
      class="image" />
    <div class="info">
      <Breadcrumb
        :home="home"
        :model="breadcrumbItems" />
      <div class="wrapper">
        <h1>{{ product.name }}</h1>
        <div class="badges">
          <div
            class="badge"
            v-for="badge in product.badges"
            :key="badge"
            :class="badge">
            {{ badge.toUpperCase() }}
          </div>
        </div>
      </div>

      <Rating
        :readonly="true"
        :cancel="false"
        :model-value="product.rating" />
      <p class="price">$ {{ product.price }}</p>
      <p class="description">{{ product.description }}</p>
      <p class="characteristic"><span class="characteristic-name">SKU:</span>{{ product.id }}</p>
      <div class="characteristic">
        <span class="characteristic-name">Categories:</span>
        <p
          v-for="category in product.categories"
          :key="category">
          {{ category }}
        </p>
      </div>
      <div class="characteristic">
        <p class="characteristic-name">Potter colors:</p>
        <input
          v-for="color in product.colors"
          :key="color"
          type="radio"
          name="color"
          class="color"
          :value="color"
          v-model="colorSelected"
          :class="color" />
      </div>

      <div
        v-if="itemExistInCart"
        class="cart-buttons">
        <div class="quantity">
          <button @click="decrementProductQuantity">-</button>
          <p>{{ itemExistInCart.quantity }}</p>
          <button @click="incrementProductQuantity">+</button>
        </div>
        <router-link
          to="/cart"
          class="btn-link btn-secondary">
          GO TO CART
        </router-link>
        <i
          class="pi"
          style="font-size: 2rem"
          :class="{ 'pi-heart': !itemExistInWishlist, 'pi-heart-fill': itemExistInWishlist }"
          @click="toggleWishlist"></i>
      </div>

      <div
        v-else
        class="cart-buttons">
        <Button
          class="p-button-lg"
          @click="addToCart"
          >ADD TO CART</Button
        >

        <i
          class="pi"
          style="font-size: 2rem"
          :class="{ 'pi-heart': !itemExistInWishlist, 'pi-heart-fill': itemExistInWishlist }"
          @click="toggleWishlist"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';

import type { IProduct } from '@/types/product';
import type { ICartItem } from '@/types/cartItem';
import type { IWishlistItem } from '@/types/wishlistItem';

import { fetchProductById } from '@/api/catalog';

const route = useRoute();

const home = ref({
  icon: 'pi pi-home',
  to: '/',
});
const breadcrumbItems = [{ label: 'catalog', url: '/catalog' }];

const product = ref<IProduct>();
const cartItems = ref<ICartItem[]>([]);
const colorSelected = ref('');
const itemExistInCart = ref();
const cartId = ref('');
const wishlistItems = ref<IWishlistItem[]>([]);
const wishlistId = ref('');
const itemExistInWishlist = ref();

const addToCart = () => {
  if (product.value) {
    const formatProduct = {
      cartId: cartId.value,
      quantity: 1,
      id: product.value.id,
      name: product.value.name,
      color: colorSelected.value,
      price: product.value.price,
      img: product.value.img,
      totalCost: product.value.price,
    };
    cartItems.value.push(formatProduct);
    localStorage.setItem('cart', JSON.stringify(cartItems.value));
    productExistInCart();
  }
};
const productExistInCart = () => {
  itemExistInCart.value = cartItems.value.find(item => item.cartId === cartId.value);
};
const incrementProductQuantity = () => {
  itemExistInCart.value.quantity += 1;
  recalculationTotal();
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
  refreshCart();
};
const decrementProductQuantity = () => {
  itemExistInCart.value.quantity -= 1;
  recalculationTotal();
  if (itemExistInCart.value.quantity >= 1) {
    localStorage.setItem('cart', JSON.stringify(cartItems.value));
  }
  if (itemExistInCart.value.quantity < 1) {
    localStorage.setItem('cart', JSON.stringify(cartItems.value.filter(item => item.cartId !== cartId.value)));
  }
  refreshCart();
};

const recalculationTotal = () => {
  itemExistInCart.value.totalCost = (product.value?.price ?? 0) * itemExistInCart.value.quantity;
};
const refreshCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
  productExistInCart();
};

const productExistInWishlist = () => {
  itemExistInWishlist.value = wishlistItems.value.find(item => item.wishlistId === wishlistId.value);
};

const toggleWishlist = () => {
  if (itemExistInWishlist.value) {
    localStorage.setItem(
      'wishlist',
      JSON.stringify(wishlistItems.value.filter(item => item.wishlistId !== wishlistId.value))
    );
    refreshWishlist();
  } else {
    if (product.value) {
      const formatProduct = {
        wishlistId: wishlistId.value,
        id: product.value.id,
        name: product.value.name,
        color: colorSelected.value,
        price: product.value.price,
        img: product.value.img,
      };
      wishlistItems.value.push(formatProduct);
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value));
      productExistInWishlist();
    }
  }
};

const refreshWishlist = () => {
  wishlistItems.value = JSON.parse(localStorage.getItem('wishlist')) || [];
  productExistInWishlist();
};

watch(colorSelected, newColor => {
  cartId.value = product.value?.id + newColor;
  productExistInCart();
});

watch(colorSelected, newColor => {
  wishlistId.value = product.value?.id + newColor;
  productExistInWishlist();
});

onMounted(async () => {
  product.value = await fetchProductById(+route.params.id);
  colorSelected.value = product.value.colors[0];
  refreshCart();
  refreshWishlist();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.wrapper {
  position: relative;
}

.badges {
  left: calc(100% + 20px);
  top: 50%;
  transform: translateY(-50%);
}

.cart-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $complementary-color;
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
.color {
  border: 4px solid $image-background-color;

  &:hover {
    border: 4px solid $secondary-color;
    opacity: 0.7;
  }
  &:checked {
    border: 4px solid $primary-color;
    opacity: 1;
  }
}

.product {
  background: $image-background-color;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @include sm {
    flex-direction: row;
  }

  @include lg {
    gap: 50px;
  }
}

.p-button-lg {
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

.description {
  text-align: left;
}

.characteristic {
  display: flex;
  gap: 10px;
  align-items: center;
}

.characteristic-name {
  font-weight: bold;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  padding: 0 20px 20px;

  @include sm {
    padding: 70px 0;
  }
}
.image {
  max-width: 300px;
  height: 100%;
  border-radius: 5px 5px 0 0;

  @include lg {
    max-width: 500px;
  }
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: $primary-color;
}

::v-deep(.pi-heart-fill) {
  color: $primary-color;
}

::v-deep(.p-breadcrumb-list) {
  text-transform: uppercase;
  font-size: 14px;
}

::v-deep(.p-breadcrumb .p-breadcrumb-list li:last-child .p-menuitem-text) {
  color: $primary-color;
}
::v-deep(.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-icon) {
  color: $primary-color;
}

::v-deep(.p-breadcrumb .p-breadcrumb-list li.p-menuitem-separator) {
  color: $primary-color;
}

::v-deep(.p-breadcrumb) {
  padding: 0;
  background: none;
  border: none;
}
</style>
