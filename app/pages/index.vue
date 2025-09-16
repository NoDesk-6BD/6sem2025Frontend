<template>
  <div class="main-content">
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

    <div class="grid grid-cols-2 gap-5">
      <dash-base component="Dashboard1" dash-name="Dashboard 1" />
      <dash-base component="Dashboard2" dash-name="Dashboard 2" />
      <dash-base component="Dashboard3" dash-name="Dashboard 3" />

      <dash-base dash-name="Chamados Críticos">
        <BarChart :data="chartData" :options="chartOptions" />
      </dash-base>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartData, ChartOptions } from "chart.js";

interface Category {
  id: string;
  name: string;
  count: number;
}

const chartData = ref<ChartData<"bar", number[], string>>({
  labels: [],
  datasets: [],
});

const chartOptions = ref<ChartOptions<"bar">>({
  responsive: true,
  indexAxis: "y",
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Chamados por Categoria Crítica" },
  },
});

async function fetchCategories() {
  try {
    const config = useRuntimeConfig();

    const res = await $fetch<Category[]>(`${config.public.apiBase}/categories`);

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      return;
    }

    chartData.value = {
      labels: res.map((c) => c.name),
      datasets: [
        {
          label: "Chamados",
          data: res.map((c) => c.count),
          backgroundColor: "#FF5252",
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
