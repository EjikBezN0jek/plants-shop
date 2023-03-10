<template>
  <div class="cart-widget">
    <div class="notice">{{ cartItemsQuantity }}</div>
    <Button class="p-button-raised p-button-rounded">
      <router-link
        to="/cart"
        class="cart">
        <i class="pi pi-shopping-cart"></i>
      </router-link>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

import { CartItemsQuantityKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const cartItemsQuantity = useInject(CartItemsQuantityKey);
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.cart-widget {
  position: relative;

  @include sm {
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 11111111;
  }
}

.notice {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(0, 0);
  width: 20px;
  height: 20px;
  background: $primary-color;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 111;

  @include sm {
    top: 0;
    right: 0;
    transform: translate(0, -30%);
  }
}

.cart {
  color: $secondary-color;
}

::v-deep(.p-button.p-button-rounded) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  background: none;
  border: none;
  border-radius: 0;
  padding: 7px;

  &:active {
    background: none;
    border: none;
  }

  & .pi-shopping-cart {
    font-size: 2.5rem;
  }

  @include sm {
    width: 45px;
    height: 45px;
    background: white;
    border: 2px solid $complementary-color;
    border-radius: 2rem;

    & .pi-shopping-cart {
      font-size: 1.5rem;
    }

    & a {
      color: $primary-color;
    }

    &:hover {
      background: $primary-color;
      border: 2px solid $primary-color;
      & a {
        color: white;
        z-index: 1111;
      }
    }
  }
}

::v-deep(.p-button:enabled:hover) {
  background: none;
  border: none;
}
</style>
