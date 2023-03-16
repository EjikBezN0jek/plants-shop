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
          class="p-button-lg product-btn"
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

  <div class="container reviews">
    <h3>Reviews ({{ moderatedReviews().length }})</h3>
    <div class="reviews-list">
      <div
        v-for="review in moderatedReviews()"
        :key="review.id"
        class="review">
        <div class="avatar">
          <p>{{ review.userName[0] }}</p>
        </div>
        <div class="review-info">
          <div class="review-header">
            <p class="review-name">
              <strong>{{ review.userName }}</strong> <small>{{ dateFormatter(review.date) }}</small>
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

    <h3>Add your review</h3>
    <form
      @submit.prevent="handleSubmit()"
      class="review-form">
      <div class="form-rating">
        <strong :class="{ error: newRating === 0 && submitted }">Your rating</strong>
        <Rating
          :cancel="false"
          v-model="newRating" />
      </div>

      <span class="p-float-label form-comment">
        <Textarea
          v-model="newComment"
          auto-resize
          rows="2"
          cols="30" />
        <label>Comment review</label>
      </span>
      <Button
        class="p-button-lg"
        type="submit"
        >PLACE REVIEW</Button
      >
    </form>
  </div>

  <div class="related container">
    <h2 v-if="relatedProducts?.length">Related Products</h2>
    <ProductCarousel :products="relatedProducts"></ProductCarousel>
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
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';

import AuthModal from '@/components/AuthModal.vue';
import ProductCarousel from '@/components/ProductCarousel.vue';

import Swiper, { Navigation, Pagination } from 'swiper';

import type { IProduct } from '@/types/product';
import type { ICartItem } from '@/types/cartItem';
import type { IWishlistItem } from '@/types/wishlistItem';
import type { IReview } from '@/types/review';

import { dateFormatter } from '@/helpers/dateFormatter';

import { fetchProductById, fetchRelatedProducts, fetchReviewsById, addReview } from '@/api/catalog';

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
  cartItemsQuantity.value = (JSON.parse(localStorage.getItem('cart') ?? '') ?? []).length;
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
    };
    addReview(newReview);
  }
};

const moderatedReviews = () => {
  return reviews.value.filter(item => item.isModerate);
};

onBeforeRouteUpdate(async to => {
  product.value = await fetchProductById(+to.params.id);
  document.documentElement.scrollTop = 0;
});

onMounted(async () => {
  product.value = await fetchProductById(+route.params.id);
  reviews.value = await fetchReviewsById(product.value.id);
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

.error {
  color: red;
}

.review-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.form-rating {
  display: flex;
  align-items: center;
  gap: 15px;
}

.form-comment {
  width: 100%;
}

::v-deep(.p-inputtextarea .p-inputtext .p-component .p-inputtextarea-resizable) {
  width: 100%;
}

::v-deep(.p-inputtextarea-resizable) {
  border-bottom: 2px solid $complementary-color;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  width: 100%;

  &:focus {
    border-bottom: 2px solid $primary-color;
  }
}

::v-deep(.p-inputtext:enabled:focus) {
  outline: 0 none;
  outline-offset: 0;
  box-shadow: none;
}

.avatar {
  width: 50px;
  height: 50px;
  background: $image-background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 10px;

  @include sm {
    padding: 30px 20px;
  }
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

.product-btn {
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
