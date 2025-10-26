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
import BarChart from "./BarChart.vue"; 

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
        // CORREÇÃO: Centraliza verticalmente e usa o callback simples para evitar o crash
        crossAlign: "center", 
        callback: function (value: string | number) {
          // SIMPLIFICADO: Retorna o array de strings (multi-linhas) já preparado pelo index.vue
          return this.getLabelForValue(value) ?? ""; 
        },
      },
    },
  },
});
</script>