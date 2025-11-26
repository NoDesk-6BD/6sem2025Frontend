<template>
  <!-- app/components/ChartCriticalCategories.vue -->
  <div>
    <client-only>
      <DoughnutChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import DoughnutChart from "./DoughnutChart.vue"; // Garanta que a importação existe

const props = defineProps<{
  chartData: ChartData<"doughnut", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.1,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 15,
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: false,
    },
    // Configuração do Tooltip (Caixa flutuante ao passar o mouse)
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.raw as number;
          // Formata o número para pt-BR (ex: 10.227)
          const formattedValue = value.toLocaleString("pt-BR");
          return ` ${label}: ${formattedValue}`;
        },
      },
    },
    // Configuração dos Rótulos de Dados (Texto fixo no gráfico)
    datalabels: {
      display: true, // Deixei falso para focar na legenda/tooltip, mude para true se quiser números em cima das fatias
      color: "#ffffff",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value: number) => {
        return value.toLocaleString("pt-BR");
      },
    },
  },
});
</script>
