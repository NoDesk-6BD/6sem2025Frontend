<template>
  <div>
    <client-only>
      <DoughnutChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  chartData: ChartData<"doughnut", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.9,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 35,
        padding: 20,
      },
    },
    title: {
      display: false,
    },
  },
});
</script>
