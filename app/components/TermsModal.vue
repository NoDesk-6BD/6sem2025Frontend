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

const acceptanceRequired = ref<{ accepted: boolean; termId: number }[]>([]);

// Atualiza a lista de aceites
function updateAcceptance(payload: { accepted: boolean; termId: number }) {
  console.log("Recebido do filho:", payload);

  const index = acceptanceRequired.value.findIndex(
    (item) => item.termId === payload.termId,
  );

  if (index !== -1) {
    acceptanceRequired.value[index] = payload;
  } else {
    acceptanceRequired.value.push(payload);
  }

  console.log("Estado atualizado:", acceptanceRequired.value);
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
    const requiredAcceptance = acceptanceRequired.value.find(
      (t) => t.termId === requiredTerms.id,
    );

    if (!requiredAcceptance || !requiredAcceptance.accepted) {
      errorMessage.value =
        "Você precisa aceitar ao menos o termo obrigatório antes de continuar.";
      return;
    }

    await $fetch(`${config.public.apiBase}/terms/accept`, {
      method: "POST",
      body: {
        user_id: props.userId,
        terms_id: requiredAcceptance.termId, // apenas o obrigatório
      },
    });

    emit("close", true);
  } catch (err) {
    console.error("Erro ao aceitar termos:", err);
    emit("close", false);
  }
}
const toast = useToast();

function DeclineTerms() {
  toast.add({
    title:
      "Você precisa aceitar ao menos o termo obrigatório antes de continuar.",
  });
  emit("close", false);
}
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }">
    <template #header>
      <h2 class="text-xl font-bold">
        Termo de uso de dados – Uso da Plataforma
      </h2>
    </template>

    <template #body>
      <TermBlock
        :term-id="requiredTerms.id"
        :term-content="requiredTerms.content"
        :is-required="true"
        @change-value="updateAcceptance"
      />

      <TermBlock
        :term-id="666"
        term-content="Seus dados poderão ser utilizados de forma agregada e anonimizada para análises estatísticas internas, possibilitando a identificação de padrões de uso, melhoria no desempenho do sistema e desenvolvimento de novas funcionalidades. Nenhuma informação pessoal individualmente identificável será compartilhada com terceiros."
        :is-required="false"
        @change-value="updateAcceptance"
      />

      <TermBlock
        :term-id="999"
        term-content="Ao aceitar este termo, você autoriza o envio de comunicações personalizadas relacionadas a funcionalidades, novidades, pesquisas de satisfação e ofertas relevantes ao seu perfil de uso. Essa comunicação poderá ocorrer por e-mail, SMS ou notificações dentro da plataforma. Você poderá revogar este consentimento a qualquer momento."
        :is-required="false"
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
