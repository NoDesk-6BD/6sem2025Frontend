<template>
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
        boxWidth: 35,
        padding: 20,
      },
    },
    title: {
      display: false,
    },
    // CORREÇÃO: Adiciona a configuração para os rótulos de dados (datalabels)
    datalabels: {
      color: "#ffffff", // Define a cor do texto para branco
      font: {
        weight: "bold", // Deixa o texto em negrito para melhor leitura
        size: 14,
      },
      // Formata o número para o padrão brasileiro (com pontos como separadores de milhar)
      formatter: (value: number) => {
        return value.toLocaleString("pt-BR");
      },
    },
  },
});
</script>
>
