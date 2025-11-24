<!-- components/TermsModal.vue -->
<script setup lang="ts">
import { useRuntimeConfig } from "#app";

import type { TermsResponse } from "~/types/interfaces";

const config = useRuntimeConfig();

const props = defineProps<{
  latest_terms: TermsResponse["latest_terms"];
  user_id: number;
}>();

const emit = defineEmits<{ close: [boolean] }>();

async function AcceptTerms() {
  try {
    await $fetch(`${config.public.apiBase}/terms/accept`, {
      method: "POST",
      body: { user_id: props.user_id },
    });

    emit("close", true);
  } catch (err) {
    console.error("Erro ao aceitar termos:", err);
    emit("close", false);
  }
}

async function DeclineTerms() {
  emit("close", false);
  navigateTo("/login");
}
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
        <UButton label="Recusar" color="neutral" @click="DeclineTerms" />

        <UButton label="Aceitar" color="primary" @click="AcceptTerms()" />
      </div>
    </template>
  </UModal>
</template>
