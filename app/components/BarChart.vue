<template>
  <!-- app/components/BarChart.vue -->
  <div class="w-full h-64 sm:h-80">
    <!-- controlar altura pelo container -->
    <Bar :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from "vue-chartjs";
import type { ChartData, ChartOptions } from "chart.js";

defineProps<{
  data: ChartData<"bar", number[], string>;
  options?: ChartOptions<"bar">;
}>();
</script>
