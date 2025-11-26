<!-- components/TermsModal.vue -->
<script setup lang="ts">
import { useRuntimeConfig } from "#app";
import TermBlock from "~/components/TermBlock.vue";
import type { TermsResponse } from "~/types/interfaces";

const config = useRuntimeConfig();

const props = defineProps<{
  userId: number;
}>();

const emit = defineEmits<{ close: [boolean] }>();

const requiredTerms: TermsResponse = await $fetch(
  `${config.public.apiBase}/terms/required`,
  {
    method: "GET",
  },
);

onBeforeMount(() => {
  if (!props.userId) {
    throw new Error("O user_id é obrigatório para TermsModal");
  }
});

async function AcceptTerms() {
  try {
    await $fetch(`${config.public.apiBase}/terms/accept`, {
      method: "POST",
      body: { user_id: props.userId, term_id: props.required.id },
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

    <template #body>
      <TermBlock :term-content="requiredTerms.content" :is-required="true" />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Recusar" color="neutral" @click="DeclineTerms" />

        <UButton label="Aceitar" color="primary" @click="AcceptTerms()" />
      </div>
    </template>
  </UModal>
</template>
