<template>
  <div>
    <client-only>
      <DoughnutChart
        :data="chartDataReactive"
        :options="chartOptions"
        :plugins="[centerTextPlugin]"
      />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Chart } from "chart.js";
import type { ChartOptions } from "chart.js";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
import DoughnutChart from "./DoughnutChart.vue";
import type { GaugeResponse } from "~/types/interfaces";

const props = defineProps<{
  chartData: GaugeResponse;
  centerLabel?: string; // texto abaixo da porcentagem
}>();

const COLORS = ["#e71831", "#efc600", "#8cd618"];
function index(perc: number) {
  return perc < 70 ? 0 : perc < 90 ? 1 : 2;
}

// Estado reativo dos dados do gráfico
const chartDataReactive = ref({
  labels: [props.chartData.datasets.label], // label único
  datasets: [
    {
      data: props.chartData.datasets.data, // array de números
      label: props.chartData.datasets.label,
      backgroundColor: ["#EAEAEA", "#EAEAEA"],
    },
  ],
});

// Watch para atualizar cores dinamicamente
watch(
  () => props.chartData.datasets[0]?.data[0],
  (percentage) => {
    if (percentage === undefined) return;
    const colorIndex = index(percentage);
    chartDataReactive.value.datasets[0].backgroundColor = [
      COLORS[colorIndex],
      "#EAEAEA",
    ];
    chartDataReactive.value.datasets[0].data = [
      ...props.chartData.datasets[0].data,
    ];
  },
  { immediate: true },
);

// Opções do gráfico
const chartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  circumference: 180,
  rotation: -90,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    title: { display: false },
    datalabels: { display: false },
    centerText: {
      label: props.centerLabel ?? "",
    },
  },
});

// Plugin local para texto central
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    if (chart.config.type !== "doughnut") return;
    if (!chart.data.datasets?.length) return;

    const dataset = chart.data.datasets[0];
    if (!dataset.data?.length) return;

    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.[0]) return;

    const { x, y } = meta.data[0];
    const percentage = dataset.data[0] as number;
    const color = COLORS[index(percentage)];

    const options = chart.config.options;
    const label = options?.plugins?.centerText?.label ?? "";

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 🔸 Ajuste dinâmico para gráficos semi-doughnut
    const isSemi = options.circumference === 180;
    const offsetY = isSemi ? -chart.height * 0.15 : 0; // número negativo sobe

    // Porcentagem
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(`${percentage}%`, x, y + offsetY);

    // Texto abaixo da porcentagem
    if (label) {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#555";
      ctx.fillText(label, x, y + offsetY + 25);
    }

    ctx.restore();
  },
};

// Registrar plugin annotation globalmente (opcional)
Chart.register(chartjsPluginAnnotation);
</script>
