<!-- components/TermsModal.vue -->
<script setup lang="ts">
import { useRuntimeConfig } from "#app";
import TermBlock from "~/components/TermBlock.vue";
import { ref, onBeforeMount } from "vue";
import type { TermsResponse } from "~/types/interfaces";

const config = useRuntimeConfig();

const props = defineProps<{
  userId: number;
}>();

const emit = defineEmits<{ close: [boolean] }>();

// Estado do pai atualizado dinamicamente pelo filho
const acceptanceRequired = ref({
  accepted: false,
  termId: null as number | null,
});

// Função acionada pelo filho via emit
function updateAcceptance(payload: { accepted: boolean; termId: number }) {
  console.log("Recebido do filho:", payload);
  acceptanceRequired.value = payload;
}

const requiredTerms: TermsResponse = await $fetch(
  `${config.public.apiBase}/terms/required`,
  { method: "GET" },
);

onBeforeMount(() => {
  if (!props.userId) {
    throw new Error("O user_id é obrigatório para TermsModal");
  } else {
    console.log("User ID recebido em TermsModal:", props.userId);
  }
});

const errorMessage = ref("");

async function AcceptTerms() {
  try {
    console.log("Estado atual em AcceptTerms():", acceptanceRequired.value);

    if (!acceptanceRequired.value.accepted) {
      errorMessage.value =
        "Você precisa aceitar o termo obrigatório antes de continuar.";
      return;
    }

    errorMessage.value = "";

    await $fetch(`${config.public.apiBase}/terms/accept`, {
      method: "POST",
      body: {
        user_id: props.userId,
        terms_id: acceptanceRequired.value.termId,
      },
    });

    emit("close", true);
  } catch (err) {
    console.error("Erro ao aceitar termos:", err);
    emit("close", false);
  }
}

function DeclineTerms() {
  emit("close", false);
}
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #header>
      <h2 class="text-xl font-bold">Termos de Uso</h2>
    </template>

    <template #body>
      <TermBlock
        :term-id="requiredTerms.id"
        :term-content="requiredTerms.content"
        :is-required="true"
        @change-value="updateAcceptance"
      />

      <div v-if="errorMessage" class="mt-3">
        <UAlert
          color="red"
          variant="solid"
          icon="i-heroicons-exclamation-triangle"
          :title="errorMessage"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Recusar" color="neutral" @click="DeclineTerms" />

        <UButton label="Aceitar" color="primary" @click="AcceptTerms" />
      </div>
    </template>
  </UModal>
</template>
