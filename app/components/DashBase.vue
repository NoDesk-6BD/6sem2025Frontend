<script setup lang="ts">
import { defineProps } from "vue";
import type { Component } from "vue";

const props = defineProps<{
  dashName: string;
  titleStyle: string;
  component: string | Component;
}>();
</script>

<template>
  <UCard class="bg-white shadow-md rounded-lg p-3 h-auto">
    <template #header>
      <div :class="props.titleStyle">
        {{ props.dashName }}
      </div>
    </template>

    <div class="mt-2">
      <ExampleChart :dash-name="props.dashName" />
    </div>
  </UCard>
</template>
