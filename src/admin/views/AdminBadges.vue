<template>
  <div>
    <h1>Badges</h1>

    <Dialog
      v-model:visible="isSuccessful"
      @hide="closeModal()"
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
        <h5>Badge Successful!</h5>
      </div>
    </Dialog>

    <BadgeModal
      v-if="isModalOpen"
      @close-modal="closeModal"
      :badges="badges"
      v-model:state="state"
      :submitted="submitted"
      :is-edit-badge="isEditBadge"
      @handle-submit="handleSubmit"
      @remove-badge="removeHandler" />

    <div class="badge-container">
      <Button
        @click="openModal"
        class="badge-btn"
        >ADD NEW BADGE</Button
      >
      <div class="items">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="item-card"
          @click="editBadge(badge)">
          <div
            class="badge"
            :style="{ background: badge.color }">
            {{ badge.label }}
          </div>
          <p>{{ badge.count }} items</p>
        </div>
      </div>
    </div>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllBadges, fetchAllProducts } from '@/api/catalog';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import BadgeModal from '@/admin/components/BadgeModal.vue';

import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import type { IBadge } from '@/types/badge';
import type { IProduct } from '@/types/product';

import { addBadge, addEditingBadge, removeBadge, addEditingProduct } from '../api/admin';

interface ICountableBadge extends IBadge {
  count: number;
}

const confirm = useConfirm();
const toast = useToast();

const submitted = ref(false);
const isModalOpen = ref(false);
const body = document.querySelector('body');
const isSuccessful = ref(false);
const isEditBadge = ref(false);

const state = ref({
  id: 0,
  name: '',
  label: '',
  color: '',
});

const badges = ref<ICountableBadge[]>();

const toggleDialog = () => {
  isSuccessful.value = !isSuccessful.value;
};

const cleanForm = () => {
  state.value.name = '';
  state.value.label = '';
  state.value.color = '';
  submitted.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
  body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditBadge.value = false;
  body.style.overflow = 'auto';
  cleanForm();
  getBadges();
};

const editBadge = (badge: IBadge) => {
  isEditBadge.value = true;
  openModal();
  state.value.id = badge.id;
  state.value.name = badge.name;
  state.value.label = badge.label;
  state.value.color = badge.color;
};

const handleSubmit = (isFormValid: any) => {
  submitted.value = true;
  if (isFormValid) {
    if (isEditBadge.value) {
      placeEditingBadge();
    } else {
      placeBadge();
    }
    closeModal();
    toggleDialog();
  }
};

const placeBadge = async () => {
  const newBadge = {
    name: state.value.name,
    label: state.value.label,
    color: state.value.color,
  };
  addBadge(newBadge);
};

const placeEditingBadge = () => {
  const editingBadge = {
    id: state.value.id,
    name: state.value.name,
    label: state.value.label,
    color: state.value.color,
  };
  addEditingBadge(editingBadge);
};

const editingProductBadges = ref<number[]>();
const productId = ref(0);

const placeEditingProduct = async () => {
  const newProduct = {
    id: productId.value,
    badges: editingProductBadges.value,
  };
  addEditingProduct(newProduct);
};

const allProducts = ref<IProduct[]>();

const removeHandler = (id: number) => {
  confirm.require({
    message: 'Do you want to delete this badge?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      allProducts.value = (await fetchAllProducts({ badges_like: id })).data;
      allProducts.value.forEach(item => {
        editingProductBadges.value = item.badges.filter(badge => badge !== id);
        productId.value = item.id;
        placeEditingProduct();
      });
      removeBadge(id);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Badge deleted', life: 3000 });
      closeModal();
      getBadges();
    },
  });
};

const getBadges = async () => {
  const rawBadges = await fetchAllBadges();

  badges.value = await Promise.all(
    rawBadges.map(async (badge: IBadge) => {
      const count = (await fetchAllProducts({ badges_like: badge.id })).data.length;
      return { ...badge, count };
    })
  );
};

onMounted(async () => {
  getBadges();
});
</script>

<style scoped lang="scss">
@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';

.badge-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.badge-btn {
  align-self: center;
}

.badge {
  width: 40px;
  height: 40px;
}
</style>
