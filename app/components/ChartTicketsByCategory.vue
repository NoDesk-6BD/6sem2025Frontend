<template>
  <div>
    <client-only>
      <LineChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  chartData: ChartData<"line", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 4,
  plugins: {
    legend: { display: true },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      grid: { display: true },
      ticks: {
        stepSize: 2,
      },
    },
  },
  elements: {
    line: {
      borderWidth: 3,
    },
  },
});
</script>
