<template>
  <div class="flex flex-col p-5 main-content">
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

    <div id="charts" class="grid grid-cols-2 gap-5">
      <dash-base
        class="col-span-2 col-start-1"
        :dash-name="dashNameList[0] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartTicketsByCategory :chart-data="TicketsByCategoryData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[2] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartCriticalProjects :chart-data="criticalProjectsData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[3] ?? ''"
        :title-style="chartTitleClass"
      >
        <DoughnutChart :chart-data="CriticalTicketsData" />
      </dash-base>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartData } from "chart.js";
import { useToast, useRuntimeConfig } from "#imports";

const chartTitleClass = "text-gray-500 font-medium text-xl";

const dashNameList = [
  "Chamados por Categoria",
  "Dashboard 2",
  "Projetos Críticos",
  "Chamados Críticos",
];

const toast = useToast();

interface Category {
  id: string;
  name: string;
  count: number[];
  abscissa: string[];
}

const CriticalTicketsData = ref<ChartData<"doughnut", number[], string>>({
  labels: [],
  datasets: [],
});

const criticalProjectsData = ref<ChartData<"bar", number[], string>>({
  datasets: [],
});

const TicketsByCategoryData = ref<ChartData<"line", number[], string>>({
  labels: [],
  datasets: [],
});

const colors = ["#FF6384", "#3480d8", "#FFCE56", "#4BC0C0", "#9966FF"];

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

    CriticalTicketsData.value = {
      labels: res.map((c) => c.name),
      datasets: [
        {
          label: "Chamados",
          data: res.flatMap((c) => c.count),
          backgroundColor: colors.slice(0, res.length), // pega só o necessário
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico ${dashNameList[3] ?? ""}`,
    });
  }
}

async function fetchCriticalProjects() {
  try {
    const config = useRuntimeConfig();

    const res = await $fetch<Category[]>(
      `${config.public.apiBase}/critical_projects`,
    );

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      toast.add({
        title: `Erro ao carregar dados do gráfico ${dashNameList[3] ?? ""}`,
      });
      return;
    }

    criticalProjectsData.value = {
      labels: res.map((c) => formatLabel(c.name, 18).join(" ")),
      datasets: [
        {
          label: "Projetos Críticos",
          data: res.flatMap((c) => c.count ?? 0),
          borderWidth: 1,
          backgroundColor: colors[1],
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico ${dashNameList[2] ?? ""}`,
    });
  }
}

async function fetchTicketsByCategory() {
  try {
    const config = useRuntimeConfig();

    const res = await $fetch<Category[]>(
      `${config.public.apiBase}/tickets_by_category`,
    );

    if (!res || !Array.isArray(res)) {
      console.error("Resposta inválida do backend:", res);
      toast.add({
        title: `Erro ao carregar dados do gráfico ${dashNameList[3] ?? ""}`,
      });
      return;
    }

    const LabelList: string[] = res.map((c) => c.name);
    const ValueList = res.map((c) => c.count);
    const abscissa = res.map((c) => c.abscissa);

    console.log("abcissa", abscissa);

    TicketsByCategoryData.value = {
      labels: abscissa[2] ?? [],
      datasets: [
        {
          label: LabelList[0]?.[0] ?? "",
          data:
            ValueList[1] && Array.isArray(ValueList[1][0])
              ? ValueList[1][0]
              : [],
          borderColor: colors[0],
          backgroundColor: colors[0],
        },
        {
          label: LabelList[0]?.[1] ?? "",
          data:
            ValueList[1] && Array.isArray(ValueList[1][1])
              ? ValueList[1][1]
              : [],
          borderColor: colors[1],
          backgroundColor: colors[1],
        },
        {
          label: LabelList[0]?.[2] ?? "",
          data:
            ValueList[1] && Array.isArray(ValueList[1][2])
              ? ValueList[1][2]
              : [],
          borderColor: colors[2],
          backgroundColor: colors[2],
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico ${dashNameList[0] ?? ""}`,
    });
  }
}

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

onMounted(() => {
  fetchCategories();
  fetchCriticalProjects();
  fetchTicketsByCategory();
});
</script>
