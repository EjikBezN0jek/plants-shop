<template>
  <div class="steps">
    <div
      v-for="item in orderStatusItems"
      :key="item.id"
      class="steps-item"
      :class="{ active: isActiveStatus(item.name) }">
      <span
        class="steps-item-info status"
        :class="item.name">
        <span class="steps-number">{{ item.id }}</span>
        <span class="steps-title">{{ item.label }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IOrderStatus } from '@/types/orderStatus';
interface IProps {
  orderStatusItems?: IOrderStatus[];
  currentStatus: string;
}

const props = defineProps<IProps>();
const isActiveStatus = (item: string) => item === props.currentStatus;
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.steps {
  display: flex;
  padding: 20px 0;
}

.steps-item {
  position: relative;
  display: flex;
  justify-content: center;
  flex: 1 1 auto;

  &:before {
    content: ' ';
    border-top: 1px solid #dee2e6;
    width: 100%;
    top: 50%;
    left: 0;
    display: block;
    position: absolute;
    margin-top: -1rem;
  }

  &.active {
    & .status {
      &.pending {
        color: rgb(94, 148, 211);
      }
      &.ready-to-ship {
        color: rgb(211, 211, 94);
      }
      &.on-the-way {
        color: rgb(211, 150, 94);
      }
      &.delivered {
        color: $primary-color;
      }
    }
  }
}

.steps-item-info {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  gap: 5px;
  border-radius: 3px;
  background: #ffffff;
  color: $secondary-color;
}

.steps-number {
  display: flex;
  justify-content: center;
  border: 1px solid #e9ecef;
  background: #ffffff;
  font-size: 18px;
  width: 35px;
  height: 35px;
  padding: 5px;
  border-radius: 50%;
  z-index: 111;
}
</style>
