<template>
  <div class="container">
    <p class="title">Checkout</p>
    <div class="checkout">
      <h2>Billing detail</h2>
      <Dialog
        v-model:visible="isSuccessful"
        @hide="redirect()"
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
          <h5>Order Successful!</h5>
        </div>
      </Dialog>

      <form
        @submit.prevent="handleSubmit(!v$.$invalid)"
        class="p-fluid form">
        <div class="customer-info">
          <div class="input-wrapper">
            <span class="p-float-label">
              <Dropdown
                id="dropdown"
                v-model="v$.country.$model"
                :options="countries"
                option-label="name"
                :class="{ 'p-invalid': v$.country.$invalid && submitted }" />
              <label
                for="dropdown"
                :class="{ 'p-error': v$.country.$invalid && submitted }"
                >Country*</label
              >
            </span>
            <small
              v-if="v$.country.$invalid && submitted"
              class="p-error"
              >{{ v$.country.required.$message.replace('Value', 'Country') }}</small
            >
          </div>

          <div class="name">
            <div class="input-wrapper">
              <span class="p-float-label">
                <InputText
                  id="firstName"
                  type="text"
                  v-model="v$.firstName.$model"
                  :class="{ 'p-invalid': v$.firstName.$invalid && submitted }" />
                <label
                  for="firstName"
                  :class="{ 'p-error': v$.firstName.$invalid && submitted }">
                  First Name*
                </label>
              </span>
              <small
                v-if="v$.firstName.$invalid && submitted"
                class="p-error"
                >{{ v$.firstName.required.$message.replace('Value', 'First Name') }}</small
              >
            </div>

            <div class="input-wrapper">
              <span class="p-float-label">
                <InputText
                  id="lastName"
                  type="text"
                  v-model="v$.lastName.$model"
                  :class="{ 'p-invalid': v$.lastName.$invalid && submitted }" />
                <label
                  for="lastName"
                  :class="{ 'p-error': v$.lastName.$invalid && submitted }"
                  >Last Name*</label
                >
              </span>
              <small
                v-if="v$.lastName.$invalid && submitted"
                class="p-error"
                >{{ v$.lastName.required.$message.replace('Value', 'Last Name') }}</small
              >
            </div>
          </div>
          <div class="input-wrapper">
            <span class="p-float-label">
              <Dropdown
                id="dropdown"
                v-model="v$.city.$model"
                :options="state.country?.cities"
                option-label="name"
                :class="{ 'p-invalid': v$.city.$invalid && submitted }" />
              <label
                for="dropdown"
                :class="{ 'p-error': v$.city.$invalid && submitted }"
                >City*</label
              >
            </span>
            <small
              v-if="v$.city.$invalid && submitted"
              class="p-error"
              >{{ v$.city.required.$message.replace('Value', 'City') }}</small
            >
          </div>

          <div class="input-wrapper">
            <span class="p-float-label">
              <InputText
                id="address"
                type="text"
                v-model="v$.address.$model"
                :class="{ 'p-invalid': v$.address.$invalid && submitted }" />
              <label
                for="address"
                :class="{ 'p-error': v$.address.$invalid && submitted }"
                >Address*</label
              >
            </span>
            <small
              v-if="v$.address.$invalid && submitted"
              class="p-error"
              >{{ v$.address.required.$message.replace('Value', 'Address') }}</small
            >
          </div>

          <div class="input-wrapper">
            <span class="p-float-label">
              <InputText
                id="email"
                type="text"
                v-model="v$.email.$model"
                aria-describedby="email-error"
                :class="{ 'p-invalid': v$.email.$invalid && submitted }" />
              <label
                for="email"
                :class="{ 'p-error': v$.email.$invalid && submitted }"
                >Email*</label
              >
            </span>

            <span v-if="v$.email.$error && submitted">
              <span
                id="email-error"
                v-for="(error, index) of v$.email.$errors"
                :key="index">
                <small class="p-error">{{ error.$message }}</small>
              </span>
            </span>
            <small
              v-else-if="v$.email.$invalid && submitted"
              class="p-error"
              >{{ v$.email.required.$message.replace('Value', 'Email') }}</small
            >
          </div>

          <span class="p-float-label">
            <InputMask
              id="phone"
              v-model="state.phone"
              mask="(999) 999-9999"
              :auto-clear="true"
              placeholder="(999) 999-9999" />
            <label for="phone">Phone</label>
          </span>

          <div class="input-wrapper">
            <span>Payment:</span>
            <div class="payment-list">
              <div
                v-for="item in paymentItems"
                :key="item.id">
                <label class="payment-item">
                  <RadioButton
                    name="payment"
                    :value="item.name"
                    v-model="v$.payment.$model" />
                  {{ item.label }}</label
                >
              </div>

              <small
                v-if="v$.payment.$invalid && submitted"
                class="p-error"
                >{{ v$.payment.required.$message.replace('Value', 'Payment') }}</small
              >
            </div>
          </div>
        </div>

        <div class="order">
          <h2>Your order</h2>

          <div class="order-list">
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
          </div>

          <Button
            class="p-button-lg"
            type="submit"
            >PLACE ORDER</Button
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Dialog from 'primevue/dialog';

import { email, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { fetchPaymentItems, fetchCountries, addOrder } from '@/api/checkout';

import type { ICartItem } from '@/types/cartItem';
import type { IPaymentItem } from '@/types/paymentItem';
import type { ICountry } from '@/types/country';
import type { ICity } from '@/types/country';

const state = ref({
  firstName: '',
  lastName: '',
  country: ref<ICountry>(),
  city: ref<ICity>(),
  address: '',
  email: '',
  phone: '',
  payment: '',
});

const rules = {
  firstName: { required },
  lastName: { required },
  country: { required },
  city: { required },
  address: { required },
  email: { required, email },
  payment: { required },
};

const submitted = ref(false);
const isSuccessful = ref(false);

const v$ = useVuelidate(rules, state);

const router = useRouter();

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    placeOrder();
    toggleDialog();

    resetForm();
  }
};

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const redirect = () => {
  router.push('user');
};

const resetForm = () => {
  state.value.firstName = '';
  state.value.lastName = '';
  state.value.email = '';
  state.value.country = undefined;
  state.value.city = undefined;
  state.value.address = '';
  state.value.phone = '';
  state.value.payment = '';
  submitted.value = false;
};

const countries = ref<ICountry[]>([]);

const shippingCost = 5;
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
    firstName: state.value.firstName,
    lastName: state.value.lastName,
    country: state.value.country?.name,
    city: state.value.city?.name,
    address: state.value.address,
    email: state.value.email,
    phone: state.value.phone,
    payment: state.value.payment,
    cart: cartItems.value,
    totalCost: productsTotal.value + shippingCost,
    status: 'pending',
  };
  addOrder(newOrder);
  cleanCart();
};

const cleanCart = () => {
  cartItems.value = [];
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

onMounted(async () => {
  paymentItems.value = await fetchPaymentItems();
  initCart();
  allProductsTotalCounter();
  countries.value = await fetchCountries();
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}

.name {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.checkout {
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 20px 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @include sm {
    flex-direction: row;
    gap: 50px;
  }
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
  @include sm {
    width: 50%;
  }
}

.order {
  background: $image-background-color;
  border-radius: 5px;
  padding: 20px 10px;

  @include sm {
    width: 50%;
  }
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

.payment-list {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-list {
  height: 76%;
  padding: 0 0 30px;
}

::v-deep(.p-fluid .p-button) {
  width: auto;
}
::v-deep(.p-dropdown),
::v-deep(.p-inputtext),
::v-deep(.p-float-label) {
  width: 100%;
}
</style>
