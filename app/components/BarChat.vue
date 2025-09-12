<script setup lang="ts">
import { Bar } from "vue-chartjs";

defineProps<{
  data: object;
  options?: object;
}>();
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
