<script setup lang="ts">
import { Line } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

defineProps<{
  data: ChartData<"line", number[], string>;
  options?: ChartOptions<"line">;
}>();
</script>

<template>
  <Line :data="data" :options="options" />
</template>
