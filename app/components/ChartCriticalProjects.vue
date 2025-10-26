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
    // NOVO: CONFIGURAÇÃO PARA DATALABELS
    datalabels: {
      color: "#fff", // Cor branca para contraste com a barra azul
      align: "center",
      anchor: "center",
      font: {
        weight: "bold", // Texto em negrito
      },
      formatter: (value: number) => {
        // Formata o número com separador de milhar (Ex: 13.867)
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
        crossAlign: "center", // Alterado de 'far' para 'center' (melhor alinhamento)
        callback: function (value: string | number) {
          return this.getLabelForValue(value) ?? "";
        },
      },
    },
  },
});
</script>
