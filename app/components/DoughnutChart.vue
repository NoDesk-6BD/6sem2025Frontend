<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { ref, defineProps } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const chartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: { display: true, position: "left" },
    title: { display: false },
  },
});

defineProps<{
  chartData: ChartData<"doughnut", number[], string>;
}>();
</script>

<template>
  <client-only>
    <Doughnut :data="chartData" :options="chartOptions" />
  </client-only>
</template>
