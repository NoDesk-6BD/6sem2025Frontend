<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  dashName: string;
  titleStyle: string;
}>();
</script>

<template>
  <UCard class="bg-white shadow-md rounded-lg p-3 max-h-[500px]">
    <template #header>
      <div :class="props.titleStyle">
        {{ props.dashName }}
      </div>
    </template>

    <div class="mt-0">
      <slot />
    </div>
  </UCard>
</template>
