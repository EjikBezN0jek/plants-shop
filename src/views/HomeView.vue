<template>
  <div class="home">
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
      src="/images/home.jpg"
      alt="home"
      class="image" />
  </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button';
</script>
<style lang="scss" scoped>
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

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
  // width: 100%;
  max-width: 100%;
  height: auto;
  filter: contrast(111%);
  filter: blur(1px);
}
</style>
