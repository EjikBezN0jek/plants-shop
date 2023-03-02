<template>
  <div class="home">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div
          v-for="image in images"
          :key="image.id"
          class="swiper-slide">
          <div class="home-title">
            <h3 class="subtitle">The Spring Plants</h3>
            <h1 class="title">WELCOME TO SHOP</h1>
            <Button class="p-button-lg"
              ><router-link
                to="/catalog"
                class="button-link"
                >More plants</router-link
              ></Button
            >
          </div>
          <img
            :src="`/images/${image.name}`"
            alt="home"
            class="image" />
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Button from 'primevue/button';

import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';

Swiper.use([Navigation, Pagination, Autoplay]);

const images = [
  {
    id: 1,
    name: 'home.jpg',
  },
  {
    id: 2,
    name: 'home-2.jpg',
  },
  {
    id: 3,
    name: 'home-3.jpg',
  },
  {
    id: 4,
    name: 'home-4.jpg',
  },
];

const createSwiper = () => {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  });
};

onMounted(async () => {
  createSwiper();
});
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '~swiper/swiper-bundle.min.css';

.container {
  max-width: 100%;
  padding: 0;
  margin: 0;
}

::v-deep(.swiper-button-next::after),
::v-deep(.swiper-button-prev::after) {
  color: white;
}

::v-deep(.swiper-pagination-bullet-active) {
  background-color: $primary-color;
}

::v-deep(.swiper-pagination) {
  position: relative;
  margin-top: 15px;
}

::v-deep(.swiper-button-disabled) {
  display: none;
}

.home {
  position: relative;
}

.home-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
}

.image {
  object-fit: cover;
  width: 100%;
  height: 450px;
  filter: contrast(111%);
  filter: blur(3px);

  @include sm {
    height: 600px;
  }
  @include md {
    height: 740px;
  }
  @include lg {
    height: 800px;
  }
}
</style>
