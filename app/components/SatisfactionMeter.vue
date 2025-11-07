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
import { Chart, type ChartData, type ChartOptions } from "chart.js";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
import DoughnutChart from "./DoughnutChart.vue";

const props = defineProps<{
  chartData: ChartData<"doughnut", number[], string>;
}>();

// Cores e índices
const COLORS = ["rgb(231, 24, 49)", "rgb(239, 198, 0)", "rgb(140, 214, 16)"];
function index(perc: number) {
  return perc < 70 ? 0 : perc < 90 ? 1 : 2;
}

// Estado reativo dos dados do gráfico
const chartDataReactive = ref({
  labels: props.chartData.labels ?? [],
  datasets: props.chartData.datasets.map((ds) => ({
    ...ds,
    backgroundColor: ["#EAEAEA", "#EAEAEA"],
  })),
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
  },
});

// Plugin local para texto central
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart: Chart) {
    if (chart.config.type !== "doughnut") return; // só doughnut
    if (!chart.data.datasets?.length) return;
    const dataset = chart.data.datasets[0];
    if (!dataset.data?.length) return;

    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const { width, height } = chartArea;

    const percentage = dataset.data[0] as number;
    const color = COLORS[index(percentage)];

    ctx.save();
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(`${percentage}%`, width / 2, height / 2 + 35);
    ctx.restore();
  },
};

// Registrar plugin annotation globalmente (opcional)
Chart.register(chartjsPluginAnnotation);
</script>
