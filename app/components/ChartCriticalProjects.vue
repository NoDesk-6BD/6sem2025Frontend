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
    legend: {
      display: true,
      position: "bottom", // Exibe a legenda na parte inferior
      labels: {
        usePointStyle: true, // Estilo de ponto para melhor visual
        padding: 10, // Espaçamento entre os itens
        // O layout em colunas será adaptado pela largura do contêiner HTML
      },
    },
    title: { display: false },
    // NOVO: CONFIGURAÇÃO PARA DATALABELS
    datalabels: {
      color: "#fff", // Cor branca para contraste com a barra azul
      align: "end",
      anchor: "end",
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
      // CORREÇÃO: Desativa a exibição do eixo Y (onde os nomes estavam)
      display: false,
      grid: { display: false },
      ticks: {
        display: false,
      },
    },
  },
});
</script>
