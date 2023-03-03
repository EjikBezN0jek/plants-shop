<template>
  <div class="container">
    <p class="title">Checkout</p>
    <div class="checkout">
      <div class="form">
        <h2>Billing detail</h2>
      </div>
      <div class="order">
        <h2>Your order</h2>
        <hr />
        <div
          v-for="product in cartItems"
          :key="product.id">
          <div class="products-list">
            <p class="name">{{ product.name }}</p>
            <div
              class="color"
              :class="product.color"></div>
            <p class="quantity">x {{ product.quantity }}</p>
            <p class="price">${{ product.price }}</p>
          </div>
        </div>
        <hr />
        <div class="row">
          <h4>Subtotal</h4>
          <p class="subtotal">${{ productsTotal }}</p>
        </div>
        <hr />
        <div class="row">
          <h4>Shipping</h4>
          <p>${{ shippingCost }}</p>
        </div>
        <hr />
        <div class="row">
          <h4>Total</h4>
          <p class="total">${{ productsTotal + shippingCost }}</p>
        </div>
        <div
          v-for="item in paymentItems"
          :key="item.id">
          <label class="payment-item">
            <RadioButton
              name="payment"
              :value="item.name"
              v-model="payment" />
            {{ item.label }}</label
          >
        </div>

        <Button
          class="p-button-lg"
          type="submit"
          @click="placeOrder()"
          >PLACE ORDER</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
// import { email, required } from '@vuelidate/validators';
// import { useVuelidate } from '@vuelidate/core';

import { fetchPaymentItems } from '@/api/catalog';

import type { ICartItem } from '@/types/cartItem';
import type { IPaymentItem } from '@/types/paymentItem';

const shippingCost = 5;
const payment = ref('');
const firstName = ref('');
const lastName = ref('');
const country = ref('');
const city = ref('');
const address = ref('');
const email = ref('');
const phone = ref('');
const productsTotal = ref(0);
const paymentItems = ref<IPaymentItem[]>([]);
const cartItems = ref<ICartItem[]>([]);

const initCart = () => {
  cartItems.value = JSON.parse(localStorage.getItem('cart') ?? '') ?? [];
};

const allProductsTotalCounter = () => {
  productsTotal.value = cartItems.value.reduce((acc, item) => acc + item.totalCost, 0);
};

const placeOrder = () => {
  const newOrder = {
    date: Date.now(),
    firstName: firstName.value,
    lastName: lastName.value,
    country: country.value,
    city: city.value,
    address: address.value,
    email: email.value,
    phone: phone.value,
    payment: payment.value,
    cart: cartItems,
    totalCost: productsTotal.value + shippingCost,
    status: 'pending',
  };
};

onMounted(async () => {
  paymentItems.value = await fetchPaymentItems();
  initCart();
  allProductsTotalCounter();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.checkout {
  display: flex;
  gap: 50px;
  padding: 20px 0;
}

.form {
  width: 50%;
}

.order {
  width: 50%;
  background: $image-background-color;
  border-radius: 5px;
  padding: 20px 10px;
}

hr {
  border: none;
  height: 2px;
  background: $complementary-color;
}

.products-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  & p {
    width: calc((100% - 45px) * 0.25);
    flex-shrink: 0;
  }

  & .name {
    text-align: left;
  }

  & .quantity {
    width: 30px;
    text-align: center;
  }

  & .price {
    text-align: right;
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  & p {
    flex-shrink: 0;
  }
}

.quantity {
  width: 30px;
  text-align: center;
}

.color {
  width: 20px;
  height: 20px;
}

.total {
  font-size: 18px;
  font-weight: bold;
  color: $primary-color;
}

.subtotal {
  font-weight: bold;
  color: $secondary-color;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
