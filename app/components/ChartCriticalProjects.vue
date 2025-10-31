// app/components/ChartCriticalProjects.vue
<template>
  <div>
    <client-only>
      <BarChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
      display: false, // Legenda geral do gráfico
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 15,
        boxWidth: 20,
      },
    },
    title: { display: false },
    tooltip: {
      callbacks: {
        // Esta função controla o título (a primeira linha) do tooltip. Retornar null ou uma string vazia remove o título completamente.
        title: function (_context) {
          return null;
        },
        // Esta função controla a linha principal do tooltip (a que tem a cor).
        label: function (context) {
          // 'context.label' já contém o nome do projeto para a barra selecionada. O Chart.js adiciona a caixinha colorida ([cor]) auto.
          const projectName = context.label || "";
          return projectName;
        },
      },
    },
    datalabels: {
      color: "#ffffff", // Define a cor do texto para branco
      align: "start",
      anchor: "end",
      font: {
        weight: "bold",
        size: 12, // Ajuste o tamanho da fonte se necessário
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
        display: false,
        padding: 5,
        crossAlign: "far",
        /*       callback: function (value: string | number) {
          const label = this.getLabelForValue
            ? typeof value === "number"
              ? this.getLabelForValue(value)
              : (value?.toString() ?? "")
            : (value?.toString() ?? "");
          // A expressão regular original para quebra de linha.
          return label.match(/.{1,18}(\s|$)/g) || [label];
        }, */
      },
    },
  },
});
</script>
