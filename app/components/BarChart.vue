// app/components/BarChart.vue
<script setup lang="ts">
import { Bar } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

defineProps<{
  data: ChartData<"bar", number[], string>;
  options?: ChartOptions<"bar">;
}>();
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
