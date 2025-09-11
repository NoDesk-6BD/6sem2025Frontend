<script setup lang="ts">
import { defineProps } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{
  dashName: string
  component: string | Component
}>()
</script>

<template>
  <UCard class="bg-white shadow-md rounded-lg p-3">
    <template #header>
      <div class="text-gray-500 font-medium text-sm">
        {{ props.dashName }}
      </div>
    </template>

    <div class="mt-2">
      <component :is="props.component" class="w-full h-64" />
    </div>
  </UCard>
</template>
