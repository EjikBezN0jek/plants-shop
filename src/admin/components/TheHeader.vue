<template>
  <div class="header">
    <div class="admin">
      <button
        ref="admin"
        class="admin-btn"
        @click="isOpenModal = true">
        <div class="avatar">
          <p>A</p>
        </div>
        <p>{{ user?.email }}</p>
      </button>
      <div
        class="modal"
        :class="{ open: isOpenModal }">
        <Button
          class="modal-btn"
          @click="quitFromAccount">
          <i
            class="pi pi-sign-out"
            style="font-size: 1rem"></i>
          Quit
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import router from '@/router';

import Button from 'primevue/button';

import { UserKey } from '@/symbols';
import { useInject } from '@/hooks/useInject';

const user = useInject(UserKey);

const isOpenModal = ref(false);
const admin = ref(null);

const clickOutside = () => {
  window.addEventListener('click', function (e) {
    if (e.target !== admin.value) {
      isOpenModal.value = false;
    }
  });
};

const quitFromAccount = () => {
  sessionStorage.removeItem('user');
  user.value = JSON.parse(sessionStorage.getItem('user') ?? '{}') ?? {};
  router.push('/');
};

onMounted(() => {
  clickOutside();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.modal {
  position: absolute;
  right: 0;
  display: none;
  border: 1px solid $complementary-color;
  padding: 10px;
  border-radius: 7px;

  &.open {
    display: flex;
  }
}

.modal-btn {
  background: none;
  border: none;
  color: $secondary-color;
  border: none;
  display: flex;
  gap: 10px;
  padding: 15px;
  height: 20px;
  width: 100%;

  &:hover {
    background: none;
    background: $image-background-color;
    color: $secondary-color;
  }

  &:focus {
    box-shadow: none;
  }
}

.admin-btn {
  background: none;
  border: none;
  color: $secondary-color;
  border: 1px solid white;
  display: flex;
  gap: 10px;
  padding: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    border-radius: 7px;
    background: none;
    border: 1px solid $complementary-color;
    color: $secondary-color;
  }

  &:focus {
    box-shadow: none;
  }
}

.header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 10px;

  @include sm {
    padding: 20px;
  }
}

.admin {
  position: relative;
  // display: flex;
  // align-items: center;
  // gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: $image-background-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-weight: bold;
  font-size: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
