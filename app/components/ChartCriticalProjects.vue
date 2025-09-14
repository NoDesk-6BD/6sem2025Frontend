<template>
  <div class="p-2 border border-gray-500 mt-4">
    <client-only>
      <BarChart :data="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted as vueOnMounted } from "vue";
import { useFetch } from "#app";

const toast = useToast();

interface ChartApiResponse {
  labels: string[];
  label: string;
  data: number[];
}

const { data: apiData, error } =
  await useFetch<ChartApiResponse>("/api/your-endpoint");

vueOnMounted(() => {
  if (error.value) {
    toast.add({ title: "Erro ao carregar dados do gráfico" });
  }
});

const chartData = ref({
  labels: apiData.labels || [
    "Projeto 1",
    "Projeto 2",
    "Projeto 3",
    "Projeto 4",
    "Projeto 5",
  ],
  datasets: [
    {
      label: apiData.label || "Projetos Críticos",
      data: apiData.data || [2, 1, 7, 3, 2],
      backgroundColor: "#3480d6",
    },
  ],
});

const chartOptions = ref({
  indexAxis: "y", // Adiciona esta linha para barras laterais (horizontal)
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    title: { display: false, text: "Meu Gráfico" },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { display: false } },
  },
});
</script>
