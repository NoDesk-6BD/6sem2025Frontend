<template>
  <div>
    <client-only>
      <BarChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  chartData: ChartData<"bar", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"bar">>({
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: {
        padding: 5,
        crossAlign: "far",
      },
    },
  },
});
</script>
