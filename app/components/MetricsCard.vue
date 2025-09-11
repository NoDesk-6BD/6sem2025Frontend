<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  tituloMetrica: string
  valorMetrica: string
}>()
</script>

<template>
  <UCard class="bg-white shadow-md rounded-lg p-1">
    <template #header>
      <div class="text-gray-500 font-medium text-xs">
        {{ props.tituloMetrica }}
      </div>
    </template>

    <div class="text-base font-bold text-gray-900 mt-1">
      {{ props.valorMetrica }}
    </div>
  </UCard>

</template>
