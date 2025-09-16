<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

defineProps<{
  data: ChartData<"doughnut", number[], string>;
  options?: ChartOptions<"doughnut">;
}>();
</script>

<template>
  <Doughnut :data="data" :options="options" />
</template>
