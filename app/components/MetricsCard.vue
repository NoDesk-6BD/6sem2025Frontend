//app/components/MetricsCard.vue
<script setup lang="ts">
import { computed, toRef } from "vue";
import type { MetricsCardResponse } from "~/types/interfaces";

const props = defineProps<{
  payload?: MetricsCardResponse;
}>();

// toRef mantém reatividade das props
const payload = toRef(props, "payload");
const relation = payload.value?.relation;
const valor = payload.value?.valor_metrica;
const top = payload.value?.top_limit;
const bottom = payload.value?.bottom_limit;
const tituloMetrica = payload.value?.titulo_metrica;

// Função auxiliar: tenta converter valores para número
const toNumber = (val: unknown): number | null => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// computed que retorna a cor (Tailwind)
const corValor = computed(() => {
  const val = toNumber(valor);
  const topVal = toNumber(top);
  const bottomVal = toNumber(bottom);

  // Se não forem numéricos, retorna cor padrão
  if (val === null || topVal === null || bottomVal === null) {
    return "text-blue-500";
  }

  // Caso a relação seja "positiva" (true) ou "negativa" (false)
  if (relation !== false) {
    if (bottomVal !== undefined && val < bottomVal) return "text-red-500";
    if (topVal !== undefined && val > topVal) return "text-blue-500";
    return "text-gray-900";
  } else {
    if (bottomVal !== undefined && val < bottomVal) return "text-blue-500";
    if (topVal !== undefined && val > topVal) return "text-red-500";
    return "text-gray-900";
  }
});
</script>

<template>
  <UCard
    class="bg-white shadow-md rounded-lg"
    :ui="{ body: { padding: 'py-2 px-4' } }"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-gray-500 font-medium text-lg">
        {{ tituloMetrica }}
      </h1>

      <div :class="corValor" class="text-xl font-bold">
        {{ valor }}
      </div>
    </div>
  </UCard>
</template>
