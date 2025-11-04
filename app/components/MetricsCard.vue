//app/components/MetricsCard.vue
<script setup lang="ts">
import { computed, toRef } from "vue";

const props = defineProps<{
  tituloMetrica: string;
  valorMetrica: number | string;
  relation?: boolean;
  bottomLimit?: number | string;
  topLimit?: number | string;
}>();

// toRef mantém reatividade das props
const relation = toRef(props, "relation");
const valor = toRef(props, "valorMetrica");
const top = toRef(props, "topLimit");
const bottom = toRef(props, "bottomLimit");

// Função auxiliar: tenta converter valores para número
const toNumber = (val: unknown): number | null => {
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// computed que retorna a cor (Tailwind)
const corValor = computed(() => {
  const val = toNumber(valor.value);
  const topVal = toNumber(top.value);
  const bottomVal = toNumber(bottom.value);

  // Se não forem numéricos, retorna cor padrão
  if (val === null || topVal === null || bottomVal === null) {
    return "text-blue-500";
  }

  // Caso a relação seja "positiva" (true) ou "negativa" (false)
  if (relation.value !== false) {
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
        {{ props.tituloMetrica }}
      </h1>

      <div :class="corValor" class="text-xl font-bold">
        {{ props.valorMetrica }}
      </div>
    </div>
  </UCard>
</template>

<!-- template #header
    <template></template>
      <h1 class="text-gray-500 font-medium text-xl">
        {{ props.tituloMetrica }}
      </h1>
    </template>

    <div class="text-2xl font-bold" :class="corValor">
      {{ props.valorMetrica }}
    </div>
  </UCard>
</template>

<style scoped>
/* Reduz o padding dos divs internos do UCard */
:deep(.p-4) {
  padding: 0.6rem !important;
}
:deep(.sm\:px-6) {
  padding-left: 0.8rem !important;
}
:deep(.sm\:p-6) {
  padding-left: 0.8rem !important;
}
</style> -->
