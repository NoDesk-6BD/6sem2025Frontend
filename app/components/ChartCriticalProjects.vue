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
import BarChart from "./BarChart.vue"; // Garanta que a importação existe

const props = defineProps<{ chartData: ChartData<"bar", number[], string> }>();

// CÓDIGO RESTAURADO: As opções originais do seu gráfico que funcionavam visualmente.
const chartOptions = ref<ChartOptions<"bar">>({
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.2,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 15,
        boxWidth: 20,
      },
    },
    title: { display: false },
    datalabels: {
      color: "#fff",
      align: "end",
      anchor: "end",
      font: {
        weight: "bold",
      },
      formatter: (value: number) => {
        return value.toLocaleString("pt-BR");
      },
    },
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
          // A expressão regular original para quebra de linha.
          return label.match(/.{1,18}(\s|$)/g) || [label];
        },
      },
    },
  },
});
</script>
