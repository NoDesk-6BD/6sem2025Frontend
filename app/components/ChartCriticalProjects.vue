<template>
  <div>
    <client-only>
      <BarChart :data="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from "vue";
import { useFetch } from "#app";
import { useToast } from "#imports";

const props = defineProps<{
  dashName: string;
}>();

const toast = useToast();

interface ChartApiResponse {
  labels: string[];
  label: string;
  data: number[];
}

const { data: apiData, error } =
  await useFetch<ChartApiResponse>("/api/your-endpoint");

onMounted(() => {
  if (error.value) {
    toast.add({ title: `Erro ao carregar dados do gráfico ${props.dashName}` });
  }
});

const formatLabel = (str: string, maxLength: number): string[] => {
  const words = str.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (
      (currentLine + " " + word).trim().length > maxLength &&
      currentLine.length > 0
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  lines.push(currentLine);

  if (lines.length <= 1) {
    return lines;
  }

  const longestLineLength = Math.max(...lines.map((line) => line.length));
  return lines.map((line) => line.padEnd(longestLineLength, " "));
};

const chartData = computed(() => {
  const defaultLabels = [
    "Prolead descrição de cargos",
    "Prolead PDI",
    "Prolead Express Yourself (Módulo para pesquisas)",
    "Coremind (Sistema de gestão de conhecimento)",
    "Guizo (Sistema de atendimento de clientes)",
    "PVP (Sistema de remuneração variável a curto prazo)",
  ];
  const defaultData = [2, 1, 6, 3, 2, 4];

  const labelsSource = apiData.value?.labels || defaultLabels;

  return {
    labels: labelsSource.map((label) => formatLabel(label, 18)),
    datasets: [
      {
        label: apiData.value?.label || "Projetos Críticos",
        data: apiData.value?.data || defaultData,
        backgroundColor: "#3480d8",
      },
    ],
  };
});

const chartOptions = ref({
  indexAxis: "y", // Adiciona esta linha para barras laterais (horizontal)
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: {
        padding: 5,
        crossAlign: "far",
      },
    },
  },
});
</script>
