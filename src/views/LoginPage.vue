<template>
  <div class="container login">
    <Dialog
      v-model:visible="showMessage"
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
        <h5>Registration Successful!</h5>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="visible"
      :breakpoints="{ '960px': '80vw' }"
      :style="{ width: '30vw' }"
      :modal="true"
      :dismissable-mask="true">
      <template #header>
        <h3 v-if="isLogin">Log in</h3>
        <h3 v-else>Register</h3>
      </template>

      <form
        class="form"
        @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="input-wrapper">
          <label
            for="email"
            :class="{ 'p-error': v$.email.$invalid && submitted }"
            >Email</label
          >
          <InputText
            id="email"
            type="text"
            v-model="v$.email.$model"
            aria-describedby="email-error"
            :class="{ 'p-invalid': v$.email.$invalid && submitted }" />

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

        <div class="input-wrapper">
          <span :class="{ 'p-error': v$.email.$invalid && submitted }">Password</span>
          <Password
            v-if="isLogin"
            v-model="state.password"
            toggle-mask
            :feedback="false"
            :class="{ 'p-invalid': v$.password.$invalid && submitted }">
          </Password>
          <Password
            v-else
            v-model="state.password"
            toggle-mask
            :class="{ 'p-invalid': v$.password.$invalid && submitted }">
          </Password>

          <small
            v-if="v$.password.$invalid && submitted"
            class="p-error"
            >{{ v$.password.required.$message.replace('Value', 'Password') }}</small
          >
        </div>

        <Button
          class="p-button-lg"
          type="submit"
          v-if="isLogin"
          >Log in</Button
        >
        <Button
          class="p-button-lg"
          type="submit"
          v-else
          >Register</Button
        >

        <button
          class="button-link"
          v-if="isLogin"
          @click="goToRegistration">
          Register
        </button>
        <button
          v-else
          class="button-link"
          @click="goToLogin">
          Log in
        </button>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Password from 'primevue/password';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';

import { email, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { addUser } from '@/api/login';

const state = ref({
  email: '',
  password: '',
});

const rules = {
  email: { required, email },
  password: { required },
};

const submitted = ref(false);
const showMessage = ref(false);
const visible = ref(true);
const isLogin = ref(true);
const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (!isLogin.value) {
      // toggleDialog();
      registration();
    } else {
      login();
    }
    resetForm();
  }
};

const toggleDialog = () => {
  showMessage.value = !showMessage.value;
};

const resetForm = () => {
  state.value.email = '';
  state.value.password = '';
  submitted.value = false;
};

const login = () => {
  console.log('log in');
  // const newUser = {
  //   email: state.value.email,
  //   password: state.value.password,
  // };
  // addUser(newUser);
};

const registration = () => {
  const newUser = {
    email: state.value.email,
    password: state.value.password,
  };
  addUser(newUser);
};

const goToRegistration = () => {
  isLogin.value = false;
};
const goToLogin = () => {
  isLogin.value = true;
};

onMounted(async () => {
  visible.value = true;
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.button-link {
  text-decoration: underline;
  border: none;
  background: none;
  color: $primary-color;
}

::v-deep(.p-inputtext),
::v-deep(.p-password) {
  width: 100%;
}

::v-deep(.p-dialog .p-dialog-content) {
  display: flex;
  align-items: center;
}

::v-deep(.p-button.p-button-lg) {
  display: block;
  max-width: 300px;
  width: 100%;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.input-wrapper {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
}
</style>
