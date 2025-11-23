<template>
  <!-- app/components/CustomLegend.vue -->
  <div
    v-if="labels.length"
    class="flex flex-wrap gap-x-6 gap-y-2 mt-2 px-2 justify-center"
  >
    <div
      v-for="(label, index) in labels"
      :key="typeof label === 'string' ? label : index"
      class="flex items-center min-w-[120px]"
    >
      <!-- Círculo colorido -->
      <span
        class="h-3 w-3 rounded-full inline-block mr-2 flex-shrink-0"
        :style="{ backgroundColor: getColor(index) }"
      />
      <!-- Texto da legenda -->
      <span
        class="text-sm text-gray-600 truncate"
        :title="typeof label === 'string' ? label : ''"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  labels: string[] | string[][]; // Aceita string[] ou string[][]
  colors: string[] | unknown; // Cores podem vir como array ou string única
}>();

// Função auxiliar para garantir que pegamos uma cor válida
const getColor = (index: number): string => {
  if (Array.isArray(props.colors)) {
    return props.colors[index] || "#ccc";
  }
  return (props.colors as string) || "#ccc";
};
</script>
