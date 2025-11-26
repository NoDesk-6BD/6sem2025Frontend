<template>
  <!-- app/components/ChartCriticalProjects.vue -->
  <div>
    <client-only>
      <BarChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import BarChart from "./BarChart.vue";

const props = defineProps<{ chartData: ChartData<"bar", number[], string> }>();

const chartOptions = ref<ChartOptions<"bar">>({
  indexAxis: "y", // Barras horizontais
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2.2, // Mantém a proporção retangular alongada
  plugins: {
    legend: {
      display: false, // DESLIGADO: Para usar a CustomLegend externa e não espremer o gráfico
    },
    title: { display: false },
    tooltip: {
      callbacks: {
        title: function () {
          return null; // Remove o título do tooltip
        },
        label: function (context) {
          const projectName = context.label || "";
          const value = context.raw as number;
          return `${projectName}: ${value.toLocaleString("pt-BR")}`;
        },
      },
    },
    datalabels: {
      color: "#ffffff",
      align: "start",
      anchor: "end",
      font: {
        weight: "bold",
        size: 12,
      },
      formatter: (value: number) => {
        return value.toLocaleString("pt-BR");
      },
    },
  },
  scales: {
    x: {
      grid: { display: true },
      ticks: {
        display: true,
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        display: false, // Oculta rótulos do eixo Y para dar mais espaço às barras (nomes já estão no tooltip/legenda externa se necessário)
      },
    },
  },
});
</script>
