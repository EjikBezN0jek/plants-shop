<template>
  <div class="footer">
    <img
      alt="Vue logo"
      src="/images/logo.png"
      class="logo" />
    <div class="socials">
      <i
        class="pi pi-facebook"
        style="font-size: 1rem"></i>
      <i
        class="pi pi-twitter"
        style="font-size: 1rem"></i>
      <i
        class="pi pi-instagram"
        style="font-size: 1rem"></i>
      <i
        class="pi pi-google"
        style="font-size: 1rem"></i>
      <i
        class="pi pi-github"
        style="font-size: 1rem"></i>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px 10px;
  flex-shrink: 0;

  @include sm {
    border-top: 2px solid $complementary-color;
  }

  @include md {
    padding: 30px 20px;
  }

  @include xxl {
    padding: 30px 75px;
  }
}

.logo {
  width: 60px;
  height: 60px;
}

.socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  & i {
    cursor: pointer;

    &:hover {
      color: $primary-color;
    }
  }
}
</style>
