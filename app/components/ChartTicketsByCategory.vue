<template>
  <!-- app/components/ChartTicketsByCategory.vue -->
  <div class="h-full w-full">
    <client-only>
      <BarChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import BarChart from "./BarChart.vue";

const props = defineProps<{
  chartData: ChartData<"bar", number[], string>;
}>();

const chartOptions = ref<ChartOptions<"bar">>({
  responsive: true,
  maintainAspectRatio: false, // RESTAURADO: Permite que o gráfico preencha todo o container pai
  layout: {
    padding: {
      top: 20,
      bottom: 60,
    },
  },
  plugins: {
    legend: {
      position: "bottom", // Legenda na parte inferior
      display: true,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const valorDoPonto = context.parsed.y;

          let totalDoMes = 0;
          context.chart.data.datasets.forEach((dataset) => {
            if (typeof dataset.data[context.dataIndex] === "number") {
              totalDoMes += dataset.data[context.dataIndex] as number;
            }
          });

          const porcentagem =
            totalDoMes > 0 ? ((valorDoPonto / totalDoMes) * 100).toFixed(2) : 0;

          return `${label}: ${porcentagem}%`;
        },
      },
    },
    datalabels: {
      display: true,
      color: "#4A4A4A",
      anchor: "end",
      align: "top",
      offset: -2,
      rotation: -75, // Rotação vertical para caber melhor nas barras
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
      grid: {
        display: false,
      },
      ticks: {
        display: true,
        color: "#4B5563",
        autoSkip: false, // RESTAURADO: Força mostrar TODOS os meses, não pula se faltar espaço
        maxRotation: 75, // Permite inclinar o texto para caber
        minRotation: 0,
        font: {
          size: 12,
          weight: "bold",
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: "#E5E7EB",
      },
      ticks: {
        precision: 0,
        color: "#9CA3AF",
        font: {
          size: 10,
        },
      },
    },
  },
});
</script>
