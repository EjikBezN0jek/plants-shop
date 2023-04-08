<template>
  <div
    v-if="product"
    class="product-container container">
    <Image
      :src="`/images/products/${product.img}`"
      :alt="`product-image-${product.img}`"
      :preview="true">
    </Image>
    <div class="info">
      <Breadcrumb
        :home="home"
        :model="breadcrumbItems" />
      <div class="wrapper">
        <h1 class="name">{{ product.name }}</h1>
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
      <div
        class="characteristic"
        v-if="colorSelected">
        <p class="characteristic-name">Potter colors:</p>
        <input
          v-for="color in findColor()"
          :key="color.id"
          type="radio"
          name="color"
          class="color"
          :value="color.id"
          v-model="colorSelected"
          :class="color.name"
          :style="{ background: color.code }" />
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
          class="like pi"
          style="font-size: 2rem"
          :class="{ 'pi-heart': !itemInWishlist, 'pi-heart-fill': itemInWishlist }"
          @click="toggleWishlist"></i>
      </div>
      <div
        v-else
        class="cart-buttons">
        <Button
          class="p-button-lg product-btn"
          @click="addToCart"
          >ADD TO CART</Button
        >

        <i
          class="like pi"
          style="font-size: 2rem"
          :class="{ 'pi-heart': !itemInWishlist, 'pi-heart-fill': itemInWishlist }"
          @click="toggleWishlist"></i>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="isSuccessful"
    :breakpoints="{ '960px': '80vw' }"
    :style="{ width: '30vw' }"
    :modal="true"
    :dismissable-mask="true">
    <template #header>
      <h3>Successful</h3>
    </template>
    <div class="flex align-items-center flex-column pt-6 px-3">
      <i
        class="pi pi-check-circle"
        :style="{ fontSize: '5rem', color: 'var(--green-500)' }"></i>
      <h5>Review Successful!</h5>
    </div>
  </Dialog>

  <div class="container">
    <ReviewsList
      :reviews="reviews"
      :reviews-all-count="reviewsAllCount"
      :pagination="pagination"
      :sort-options="sortOptions?.reviews"
      v-model:sorting="sorting"
      @change-page="changePage"
      @update:sorting="refetchReviews" />

    <div class="wrapper">
      <h3>Add your review</h3>
      <ReviewForm
        v-model:newRating="newRating"
        v-model:newComment="newComment"
        :submitted="submitted"
        @handle-submit="handleSubmit" />
    </div>
  </div>

  <div class="related container">
    <h2 v-if="relatedProducts?.length">Related Products</h2>
    <ProductCarousel
      :products="relatedProducts"
      :colors-list="colorsList"></ProductCarousel>
  </div>

  <AuthModal
    v-if="isShowAuth"
    @hide="toggleAuthModal" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';

import AuthModal from '@/components/AuthModal.vue';
import ProductCarousel from '@/components/ProductCarousel.vue';
import ReviewForm from '@/components/ReviewForm.vue';
import ReviewsList from '@/components/ReviewsList.vue';

import { usePagination } from '@/hooks/usePagination';

import Swiper, { Navigation, Pagination } from 'swiper';

import type { IProduct } from '@/types/product';
import type { ICartItem } from '@/types/cartItem';
import type { IWishlistItem } from '@/types/wishlistItem';
import type { IReview } from '@/types/review';
import type { ISortOptions } from '@/types/sortOptions';
import type { ISorting } from '@/types/sorting';
import type { IColor } from '@/types/color';

import {
  fetchProductById,
  fetchRelatedProducts,
  fetchReviews,
  addReview,
  fetchSortOptions,
  fetchAllColors,
} from '@/api/catalog';

import { UserKey, CartItemsQuantityKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

Swiper.use([Navigation, Pagination]);

const cartItemsQuantity = useInject(CartItemsQuantityKey);

const isShowAuth = ref(false);
const toggleAuthModal = () => (isShowAuth.value = !isShowAuth.value);

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

const colorsList = ref<IColor[]>([]);
const colorSelected = ref(0) || null;

const findColor = () => {
  return colorsList.value.filter(color => product.value?.colors.includes(color.id));
};

const findColorById = (id: number) => {
  return colorsList.value.find(color => color.id === id);
};

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
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
};

watch(colorSelected, newColor => {
  if (product.value && newColor) {
    cartId.value = product.value.id + findColorById(newColor).name;
    getProductFromCart();
  }
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
  if (product.value && newColor) {
    wishlistId.value = product.value.id + findColorById(newColor).name;
    getProductFromWishlist();
  }
});

watch(
  wishlistItems,
  () => {
    saveWishlist();
    getProductFromWishlist();
  },
  { deep: true }
);

watch(route, () => {
  if (product.value) colorSelected.value = product.value.colors[0];
  getProductFromWishlist();
  getRelatedProducts();
});

const reviews = ref<IReview[]>([]);
const newRating = ref(0);
const newComment = ref('');

const user = useInject(UserKey);

const submitted = ref(false);
const isSuccessful = ref(false);

const handleSubmit = () => {
  submitted.value = true;
  if (user.value?.name) {
    if (newRating.value > 0) {
      placeReview();
      toggleDialog();
      resetForm();
      submitted.value = false;
    }
  } else {
    isShowAuth.value = true;
  }
};

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const resetForm = () => {
  newRating.value = 0;
  newComment.value = '';
};

const placeReview = () => {
  if (product.value && user.value) {
    const newReview = {
      productId: product.value.id,
      userName: user.value.name,
      date: Date.now(),
      rating: newRating.value,
      comment: newComment.value,
      isModerate: false,
      productName: product.value.name,
      productImage: product.value.img,
    };
    addReview(newReview);
  }
};

//Sorting
const sorting = ref<ISorting>({ target: 'date', order: 'desc', label: 'Date: new to old' });
const sortOptions = ref<ISortOptions>();

const reviewsAllCount = ref(0);

const getReviews = async () => {
  const params = {
    productId: product.value?.id,
    isModerate: true,
    _sort: sorting.value.target,
    _order: sorting.value.order,
    _page: pagination.value.current,
    _limit: 2,
  };
  const { data, pagination: p } = await fetchReviews(params);
  reviews.value = data;
  reviewsAllCount.value = p.items;
  setPagination(p);
};

const refetchReviews = () => {
  resetCurrentPage();
  getReviews();
};

//Pagination
const { pagination, setPagination, resetCurrentPage, setCurrentPage } = usePagination();

const changePage = (page: number) => {
  setCurrentPage(page);
  getReviews();
};

onBeforeRouteUpdate(async to => {
  product.value = await fetchProductById(+to.params.id);
  refetchReviews();
  document.documentElement.scrollTop = 0;
});

onMounted(async () => {
  product.value = await fetchProductById(+route.params.id);
  sortOptions.value = await fetchSortOptions();
  colorsList.value = await fetchAllColors();
  getReviews();
  if (product.value) colorSelected.value = product.value.colors[0];
  initCart();
  initWishlist();
  getRelatedProducts();
  createSwiper();
  // findColor();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.like {
  cursor: pointer;
}

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

  @include md {
    max-width: 50%;
  }
}

.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  padding: 0 0 20px;
  width: 300px;

  @include sm {
    padding: 70px 0;
    width: 450px;
  }
}
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.name {
  text-align: left;
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
  flex-wrap: wrap;
}

.characteristic-name {
  font-weight: bold;
  text-align: left;
}

.color {
  flex-shrink: 0;
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
    height: 45px;
    width: 45px;
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
::v-deep(.p-image.p-component.p-image-preview-container img) {
  max-width: 300px;
  height: 100%;
  border-radius: 5px 5px 0 0;

  @include md {
    max-width: 50%;
  }
}

::v-deep(.p-image-preview-indicator) {
  border: 1px solid $primary-color;
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
</style>
