<!-- components/TermsModal.vue -->
<script setup lang="ts">
import type { TermsResponse } from "~/types/interfaces"; // se tiver tipado

defineProps<{
  latest_terms: TermsResponse["latest_terms"];
}>();

const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #header>
      <h2 class="text-xl font-bold">Termos de Uso</h2>
    </template>

    <p class="whitespace-pre-line">
      {{ latest_terms.content }}
    </p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Recusar"
          color="neutral"
          @click="emit('close', false)"
        />
        <UButton label="Aceitar" color="primary" @click="emit('close', true)" />
      </div>
    </template>
  </UModal>
</template>
