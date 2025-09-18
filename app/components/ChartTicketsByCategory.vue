<template>
  <div>
    <client-only>
      <LineChart :data="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

const { chartData } = defineProps<{
  chartData: ChartData<"line", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"line">>({
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
    },
  },
});
onMounted(() => {
  console.log(`chart da ==`, chartData);
});
</script>
