<template>
  <div class="main-content">
    <div>
      <div class="grid grid-cols-2 mb-7">
        <h1 class="text-2xl font-bold mb-4 self-center">KPI Cards</h1>
        <TimeFilter />
      </div>
      <div class="grid grid-cols-4 gap-5 mb-7">
        <MetricsCard
          titulo-metrica="Metrica 1"
          :valor-metrica="15"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Metrica 2"
          :valor-metrica="31"
          :bottom-limit="3"
          :top-limit="10"
          :relation="false"
        />
        <MetricsCard
          titulo-metrica="Metrica 3"
          :valor-metrica="77"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Metrica 4"
          :valor-metrica="42"
          :bottom-limit="40"
          :top-limit="50"
          :relation="true"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <dash-base dash-name="Dashboard 1" :title-style="chartTitleClass" />
      <dash-base dash-name="Dashboard 2" :title-style="chartTitleClass" />
      <dash-base
        :dash-name="dashNameList[2] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartCriticalProjects :dash-name="dashNameList[2] ?? ''" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[3] ?? ''"
        :title-style="chartTitleClass"
      >
        <DoughnutChart :data="chartData" :options="chartOptions" />
      </dash-base>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartData, ChartOptions } from "chart.js";
import DoughnutChart from "~/components/DoughnutChart.vue";
import { useToast, useRuntimeConfig } from "#imports";

const chartTitleClass = "text-gray-500 font-medium text-xl";

const dashNameList = [
  "Dashboard 1",
  "Dashboard 2",
  "Projetos Críticos",
  "Chamados Críticos",
];

const toast = useToast();

interface Category {
  id: string;
  name: string;
  count: number;
}

const chartData = ref<ChartData<"doughnut", number[], string>>({
  labels: [],
  datasets: [],
});

const chartOptions = ref<ChartOptions<"doughnut">>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "top" },
    title: { display: true, text: "Chamados por Categoria Crítica" },
  },
});

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

async function fetchCategories() {
  try {
    const config = useRuntimeConfig();

    const res = await $fetch<Category[]>(`${config.public.apiBase}/categories`);

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      toast.add({
        title: `Erro ao carregar dados do gráfico ${dashNameList[3] ?? ""}`,
      });
      return;
    }

    chartData.value = {
      labels: res.map((c) => c.name),
      datasets: [
        {
          label: "Chamados",
          data: res.map((c) => c.count),
          backgroundColor: colors.slice(0, res.length), // pega só o necessário
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
}

onMounted(() => {
  fetchCategories();
});
</script>
