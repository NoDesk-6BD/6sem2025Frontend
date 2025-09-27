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
  aspectRatio: 2.2,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: true },
    },
    y: {
      grid: { display: false },
      ticks: {
        padding: 5,
        crossAlign: "far",
        callback: function (value: string | number) {
          const label = this.getLabelForValue
            ? typeof value === "number"
              ? this.getLabelForValue(value)
              : (value?.toString() ?? "")
            : (value?.toString() ?? "");
          return label.match(/.{1,18}(\s|$)/g) || [label];
        },
      },
    },
  },
});
</script>
