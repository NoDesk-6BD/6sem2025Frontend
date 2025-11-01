// app/components/DashBase.vue
<script setup lang="ts">
// import { defineProps } from "vue"; // defineProps é um macro global em <script setup>

const props = defineProps<{
  dashName: string;
  titleStyle: string;
}>();
</script>

<template>
  <UCard
    class="bg-white shadow-md rounded-lg p-3 min-h-[20vh] max-h-[50vh] overflow-hidden"
  >
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
