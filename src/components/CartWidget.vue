<template>
  <div class="cart-widget">
    <div class="notice">{{ cartItemsQuantity }}</div>
    <Button class="p-button-raised p-button-rounded">
      <router-link to="/cart">
        <i
          class="pi pi-shopping-cart"
          style="font-size: 1.25rem"></i>
      </router-link>
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

interface IProps {
  cartItemsQuantity?: number;
}
const props = defineProps<IProps>();
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.cart-widget {
  display: none;

  @include sm {
    display: block;
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
  transform: translate(30%, -30%);
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
}

::v-deep(.p-button.p-button-rounded) {
  position: relative;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  background: white;
  border: 2px solid $complementary-color;
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
</style>
