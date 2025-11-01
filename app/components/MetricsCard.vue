//app/components/MetricsCard.vue
<script setup lang="ts">
import { defineProps, computed, toRef } from "vue";

const props = defineProps<{
  tituloMetrica: string;
  valorMetrica: number;
  relation?: boolean;
  bottomLimit?: number;
  topLimit?: number;
}>();

// toRef para manter reatividade se props mudarem no pai
const relation = toRef(props, "relation");
const valor = toRef(props, "valorMetrica");
const top = toRef(props, "topLimit");
const bottom = toRef(props, "bottomLimit");

// computed que retorna a classe (Tailwind) — simples e seguro
const corValor = computed(() => {
  if (relation.value !== false) {
    if (bottom.value !== undefined && valor.value < bottom.value)
      return "text-red-500";
    if (top.value !== undefined && valor.value > top.value)
      return "text-blue-500";
    return "text-gray-900";
  } else {
    if (bottom.value !== undefined && valor.value < bottom.value)
      return "text-blue-500";
    if (top.value !== undefined && valor.value > top.value)
      return "text-red-500";
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
