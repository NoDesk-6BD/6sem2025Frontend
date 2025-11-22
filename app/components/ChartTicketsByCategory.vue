<template>
  <!-- app/components/ChartTicketsByCategory.vue -->
  <div class="h-full">
    <client-only>
      <BarChart :data="props.chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
// CORREÇÃO: Importa o componente base de gráfico de barras
import BarChart from "./BarChart.vue";

const props = defineProps<{
  chartData: ChartData<"bar", number[], string>;
}>();

// CORREÇÃO: Opções ajustadas para um gráfico de barras verticais agrupadas
const chartOptions = ref<ChartOptions<"bar">>({
  responsive: true,
  // Desativa o aspect ratio para permitir que o gráfico preencha o contêiner
  maintainAspectRatio: false,
  // CORREÇÃO: Adiciona um layout com padding no topo para os datalabels não serem cortados.
  layout: {
    padding: {
      top: 30, // Aumenta o espaço no topo do gráfico.
    },
  },
  plugins: {
    legend: {
      position: "bottom", // Move a legenda para a parte inferior para mais clareza
      display: true,
    },
    title: {
      display: false,
    },
    // POrcentagem gráficos ND-66
    tooltip: {
      callbacks: {
        // Esta função personaliza o texto de cada item no tooltip
        label: function (context) {
          // Pega o nome da categoria (ex: "Hardware")
          const label = context.dataset.label || "";
          // Pega o valor numérico do ponto/barra
          const valorDoPonto = context.parsed.y;

          // Calcula a soma de todas as categorias para o mesmo mês
          let totalDoMes = 0;
          context.chart.data.datasets.forEach((dataset) => {
            // Soma o valor de cada dataset no mesmo índice (mesmo mês)
            if (typeof dataset.data[context.dataIndex] === "number") {
              totalDoMes += dataset.data[context.dataIndex] as number;
            }
          });

          // Calcula a porcentagem, evitando divisão por zero
          const porcentagem =
            totalDoMes > 0 ? ((valorDoPonto / totalDoMes) * 100).toFixed(2) : 0;

          // Retorna o texto final formatado
          return `${label}: (${porcentagem}%)`;
        },
      },
    },
    // CORREÇÃO: Configuração dos datalabels para exibição vertical
    datalabels: {
      display: true, // Habilita a exibição dos valores
      color: "#4A4A4A", // Define a cor para cinza escuro
      anchor: "end", // Ancorar o label no topo da barra
      align: "top", // Alinhar o label acima do ponto de ancoragem
      offset: 1, // Deslocamento de 8 pixels para cima (efeito flutuante)
      rotation: -45, // Rotaciona o texto 270 graus (vertical)
      font: {
        weight: "bold",
      },
      formatter: (value: number) => {
        // Formata o número para o padrão brasileiro
        return value.toLocaleString("pt-BR");
      },
      // Adiciona um pequeno preenchimento para não ficar colado na barra
      padding: {
        bottom: 6,
      },
    },
  },
  scales: {
    x: {
      // Períodos de tempo (meses)
      grid: {
        display: false, // Remove as linhas de grade verticais para um look mais limpo
      },
    },
    y: {
      // Contagem de chamados
      beginAtZero: true,
      grid: {
        display: true,
      },
      ticks: {
        precision: 0, // Garante que o eixo Y não tenha casas decimais
      },
    },
  },
});
</script>
