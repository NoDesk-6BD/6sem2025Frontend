<template>
  <div>
    <client-only>
      <LineChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import LineChart from "~/components/LineChart.vue"; // Garanta que a importação do componente base existe

const props = defineProps<{
  chartData: ChartData<"line", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"line">>({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 5.5,
  plugins: {
    legend: {
      position: "top",
      display: true,
    },
    title: {
      display: false,
    },
    // CORREÇÃO: Adiciona a configuração para os rótulos de dados (datalabels)
    datalabels: {
      display: true, // Garante que os labels sejam exibidos
      color: "#4A4A4A", // Define a cor para cinza escuro
      anchor: "end", // Ancorar o label ao ponto de dados
      align: "top", // Alinhar o label acima do ponto
      offset: 1, // Deslocamento de 8 pixels para cima (efeito flutuante)
      font: {
        weight: "bold", // Texto em negrito para melhor leitura
      },
      // Formata o número (opcional, mas recomendado)
      formatter: (value: number) => {
        return value.toLocaleString("pt-BR");
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
      ticks: {
        stepSize: 2,
      },
    },
  },
  elements: {
    line: {
      borderWidth: 3,
    },
  },
});
</script>
