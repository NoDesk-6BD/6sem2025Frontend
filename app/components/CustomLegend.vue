// app/components/CustomLegend.vue

<template>
  <div
    v-if="labels.length"
    class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-4 px-4"
  >
    <div
      v-for="(label, index) in labels"
      :key="label"
      class="flex items-center"
    >
      <span
        class="h-3 w-3 rounded-sm inline-block mr-2"
        :style="{ backgroundColor: colors[index] }"
      />
      <span class="text-sm text-gray-600 truncate" :title="label">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  labels: string[];
  colors: string[];
}>();
</script>
