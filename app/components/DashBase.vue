<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  dashName: string;
}>();
</script>

<template>
  <UCard class="bg-white shadow-md rounded-lg p-3 max-h-[500px]">
    <template #header>
      <div class="text-gray-500 font-medium text-sm">
        {{ props.dashName }}
      </div>
    </template>

    <div class="mt-2">
      <slot />
    </div>
  </UCard>
</template>
