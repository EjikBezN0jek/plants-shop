<template>
  <div
    v-if="product"
    class="product-container">
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
        <div class="badges info-badges">
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
        v-if="itemInCart"
        class="cart-buttons">
        <div class="quantity">
          <button @click="decrementProductQuantity">-</button>
          <p>{{ itemInCart.quantity }}</p>
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
          :class="{ 'pi-heart': !itemInWishlist, 'pi-heart-fill': itemInWishlist }"
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
          :class="{ 'pi-heart': !itemInWishlist, 'pi-heart-fill': itemInWishlist }"
          @click="toggleWishlist"></i>
      </div>
    </div>
  </div>
  <div class="related">
    <h2 v-if="relatedProducts?.length">Related Products</h2>
    <ProductCarousel :products="relatedProducts"></ProductCarousel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';

import ProductCarousel from '@/components/ProductCarousel.vue';

import Swiper, { Navigation, Pagination } from 'swiper';

import type { IProduct } from '@/types/product';
import type { ICartItem } from '@/types/cartItem';
import type { IWishlistItem } from '@/types/wishlistItem';

import { fetchProductById, fetchRelatedProducts } from '@/api/catalog';

Swiper.use([Navigation, Pagination]);

const createSwiper = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 992: { slidesPerView: 4 } },
  });
};

const relatedProducts = ref<IProduct[]>();

const getRelatedProducts = async () => {
  const params = {
    categories_like: product.value?.categories,
    _limit: 8,
    id_ne: product.value?.id,
  };
  relatedProducts.value = shuffleRelatedProducts(await fetchRelatedProducts(params));
};

const shuffleRelatedProducts = (products: IProduct[]) => {
  return products.sort(() => Math.random() - 0.5);
};

const route = useRoute();

const home = ref({
  icon: 'pi pi-home',
  to: '/',
});
const breadcrumbItems = [{ label: 'catalog', url: '/catalog' }];

const product = ref<IProduct>();

const cartItems = ref<ICartItem[]>([]);
const itemInCart = ref();
const cartId = ref('');
const colorSelected = ref('');

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
  }
};

const getProductFromCart = () => {
  itemInCart.value = cartItems.value.find(item => item.cartId === cartId.value);
};

const initCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart') ?? '') ?? [];
};

const incrementProductQuantity = () => {
  itemInCart.value.quantity += 1;
  recalculationTotal();
};

const decrementProductQuantity = () => {
  itemInCart.value.quantity -= 1;
  recalculationTotal();
  if (itemInCart.value.quantity < 1) {
    removeProductFromCart();
  }
};

const recalculationTotal = () => {
  itemInCart.value.totalCost = itemInCart.value.price * itemInCart.value.quantity;
};

const removeProductFromCart = () => {
  cartItems.value = cartItems.value.filter(item => item.cartId !== itemInCart.value.cartId);
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

watch(colorSelected, newColor => {
  cartId.value = product.value?.id + newColor;
  getProductFromCart();
});

watch(
  cartItems,
  () => {
    saveCart();
    getProductFromCart();
  },
  { deep: true }
);

const wishlistItems = ref<IWishlistItem[]>([]);
const wishlistId = ref('');
const itemInWishlist = ref();

const getProductFromWishlist = () => {
  itemInWishlist.value = wishlistItems.value.find(item => item.wishlistId === wishlistId.value);
};

const toggleWishlist = () => {
  if (itemInWishlist.value) {
    removeProductFromWishlist();
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
    }
  }
};

const initWishlist = () => {
  wishlistItems.value = JSON.parse(localStorage.getItem('wishlist') ?? '') ?? [];
};

const removeProductFromWishlist = () => {
  wishlistItems.value = wishlistItems.value.filter(item => item.wishlistId !== itemInWishlist.value.wishlistId);
};

const saveWishlist = () => {
  localStorage.setItem('wishlist', JSON.stringify(wishlistItems.value));
};

watch(colorSelected, newColor => {
  wishlistId.value = product.value?.id + newColor;
  getProductFromWishlist();
});

watch(
  wishlistItems,
  () => {
    saveWishlist();
    getProductFromWishlist();
  },
  { deep: true }
);

onBeforeRouteUpdate(async to => {
  product.value = await fetchProductById(+to.params.id);
  document.documentElement.scrollTop = 0;
});

onMounted(async () => {
  product.value = await fetchProductById(+route.params.id);
  colorSelected.value = product.value.colors[0];
  initCart();
  initWishlist();
  getRelatedProducts();
  createSwiper();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '~swiper/swiper-bundle.min.css';

.product-container {
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

.related {
  padding: 50px 0;
}

.image {
  max-width: 300px;
  height: 100%;
  border-radius: 5px 5px 0 0;

  @include lg {
    max-width: 500px;
  }
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  padding: 0 20px 20px;
  width: 300px;

  @include sm {
    padding: 70px 0;
    width: 450px;
  }
}
.wrapper {
  position: relative;
}

.info-badges {
  left: calc(100% + 20px);
  top: 50%;
  transform: translateY(-50%);
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: $primary-color;
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

::v-deep(.p-breadcrumb-list) {
  text-transform: uppercase;
  font-size: 14px;
}

::v-deep(.p-breadcrumb) {
  padding: 0;
  background: none;
  border: none;
}

::v-deep(.p-breadcrumb .p-breadcrumb-list li:last-child .p-menuitem-text),
::v-deep(.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-icon),
::v-deep(.p-breadcrumb .p-breadcrumb-list li.p-menuitem-separator),
::v-deep(.pi-heart-fill) {
  color: $primary-color;
}

// ::v-deep(.swiper-pagination-bullet-active) {
//   background-color: $primary-color;
// }

// ::v-deep(.swiper-pagination) {
//   position: relative;
// }

// ::v-deep(.swiper-button-disabled) {
//   display: none;
// }
</style>
