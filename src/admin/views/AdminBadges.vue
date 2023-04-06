<template>
  <div>
    <h1>Badges</h1>
    <div class="items">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="item-card">
        <i
          class="pi pi-verified"
          :style="{ fontSize: '3rem', color: 'var(--green-500)' }"></i>
        <strong>{{ badge.label }}</strong>
        <p>{{ badge.count }} items</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllBadges, fetchAllProducts } from '@/api/catalog';

import type { IBadge } from '@/types/badge';

interface ICountableBadge extends IBadge {
  count: number;
}

const badges = ref<ICountableBadge[]>();

onMounted(async () => {
  const rawBadges = await fetchAllBadges();

  badges.value = await Promise.all(
    rawBadges.map(async (badge: IBadge) => {
      const count = (await fetchAllProducts({ badges_like: badge.name })).data.length;
      return { ...badge, count };
    })
  );
});
</script>

<style scoped lang="scss"></style>
