<template>
  <div class="login">
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
        <h5>Registration Successful!</h5>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="isError"
      :breakpoints="{ '960px': '80vw' }"
      :style="{ width: '30vw' }"
      :modal="true"
      :dismissable-mask="true">
      <template #header>
        <h3>Error</h3>
      </template>
      <div class="flex align-items-center flex-column pt-6 px-3">
        <i
          class="pi pi-times-circle"
          :style="{ fontSize: '5rem', color: 'var(--red-500)' }"></i>
        <h5>{{ errorMessage }}</h5>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="isShowModal"
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
            for="name"
            :class="{ 'p-error': v$.name.$invalid && submitted }"
            >Name</label
          >
          <InputText
            id="name"
            type="text"
            v-model="v$.name.$model"
            :class="{ 'p-invalid': v$.name.$invalid && submitted }" />

          <small
            v-if="v$.name.$invalid && submitted"
            class="p-error"
            >{{ v$.name.required.$message.replace('Value', 'Name') }}</small
          >
        </div>
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
          <span :class="{ 'p-error': v$.password.$invalid && submitted }">Password</span>
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
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import Password from 'primevue/password';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

import { email, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

import { registerUser, loginUser } from '@/api/user';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const user = useInject(UserKey);
const router = useRouter();

const state = ref({
  name: '',
  email: '',
  password: '',
});

const rules = {
  name: { required },
  email: { required, email },
  password: { required },
};

const submitted = ref(false);
const isSuccessful = ref(false);
const isShowModal = ref(true);
const visible = ref(true);
const isLogin = ref(true);
const v$ = useVuelidate(rules, state);

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (!isLogin.value) {
      registration();
    } else {
      login();
    }
    resetForm();
  }
};

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const toggleModal = () => {
  isShowModal.value = !isShowModal.value;
};

const resetForm = () => {
  state.value.name = '';
  state.value.email = '';
  state.value.password = '';
  submitted.value = false;
};

const errorMessage = ref('');
const isError = ref(false);

const registration = async () => {
  const newUser = {
    name: state.value.name,
    email: state.value.email,
    password: state.value.password,
    orders: [],
  };

  try {
    const { data } = await registerUser(newUser);
    user.value = data.user;
    toggleDialog();
    toggleModal();
    sessionStorage.setItem('user', JSON.stringify(user.value));
  } catch (error) {
    if (error.response) {
      isError.value = true;
      errorMessage.value = error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
  }
};

const login = async () => {
  const oldUser = {
    name: state.value.name,
    email: state.value.email,
    password: state.value.password,
  };

  try {
    const { data } = await loginUser(oldUser);
    user.value = data.user;
    toggleModal();
    sessionStorage.setItem('user', JSON.stringify(user.value));
  } catch (error) {
    if (error.response) {
      isError.value = true;
      errorMessage.value = error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
  }
};

const goToRegistration = () => {
  visible.value = true;
  isLogin.value = false;
  resetForm();
};
const goToLogin = () => {
  visible.value = true;
  isLogin.value = true;
  resetForm();
};

onMounted(async () => {
  visible.value = true;
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.container {
  flex-grow: 1;
}

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
