<template>
  <div class="p-2 border border-gray-500 mt-4">
    <client-only>
      <BarChart :data="chartData" :options="chartOptions" />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const chartData = ref({
  labels: [1, 2, 3, 4, 5],
  datasets: [
    {
      label: "Teste1",
      data: [2, 1, 7, 3, 2],
      backgroundColor: "rgba(20, 255, 0, 0.3)",
      borderColor: "rgba(100, 255, 0, 1)",
      borderWidth: 2,
    },
  ],
});

const chartOptions = ref({
  indexAxis: "y", // Adiciona esta linha para barras laterais (horizontal)
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: true },
    title: { display: false, text: "Meu Gráfico" },
  },
});
</script>
