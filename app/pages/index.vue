<template>
  <div class="flex flex-col p-2 main-content">
    <div>
      <div class="grid grid-cols-2 align-items-center">
        <h1 class="text-2xl font-bold mb-4 self-center">KPI Cards</h1>
        <TimeFilter @update-range="onRangeUpdate" />
      </div>

      <div class="grid grid-cols-4 gap-2 mb-2">
        <MetricsCard
          titulo-metrica="Métrica 1"
          :valor-metrica="3"
          :bottom-limit="4"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Métrica 2"
          :valor-metrica="6"
          :bottom-limit="3"
          :top-limit="10"
          :relation="false"
        />
        <MetricsCard
          titulo-metrica="Métrica 3"
          :valor-metrica="9"
          :bottom-limit="3"
          :top-limit="10"
          :relation="true"
        />
        <MetricsCard
          titulo-metrica="Métrica 4"
          :valor-metrica="12"
          :bottom-limit="5"
          :top-limit="10"
          :relation="true"
        />
      </div>
    </div>

    <div id="charts" class="grid grid-cols-2 gap-2">
      <dash-base
        class="col-span-2 col-start-1"
        :dash-name="dashNameList[0] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartTicketsByCategory :chart-data="TicketsByCategoryData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[1] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartCriticalProjects :chart-data="CriticalProjectsData" />
      </dash-base>

      <dash-base
        :dash-name="dashNameList[2] ?? ''"
        :title-style="chartTitleClass"
      >
        <ChartCriticalCategories :chart-data="CriticalCategoriesData" />
      </dash-base>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ChartData } from "chart.js";
import { useToast } from "#imports";
import ChartTicketsByCategory from "~/components/ChartTicketsByCategory.vue";
import ChartCriticalProjects from "~/components/ChartCriticalProjects.vue";
import ChartCriticalCategories from "../components/ChartCriticalCategories.vue";

const chartTitleClass = "text-gray-500 font-medium text-xl";

const dashNameList = [
  "Evolução de Chamados por Categoria",
  "Projetos Críticos",
  "Subcategorias Críticas",
];

const toast = useToast();

const CriticalCategoriesData = ref<ChartData<"doughnut", number[], string>>({
  labels: [],
  datasets: [],
});

const CriticalProjectsData = ref<ChartData<"bar", number[], string>>({
  labels: [],
  datasets: [],
});

const TicketsByCategoryData = ref<ChartData<"line", number[], string>>({
  labels: [],
  datasets: [],
});

const colors = [
  "#1E78B6", // Azul
  "#EF4444", // Vermelho
  "#10B981", // Verde
  "#F59E0B", // Amarelo
  "#8B5CF6", // Roxo
  "#EC4899", // Rosa
  "#14B8A6", // Turquesa
  "#F97316", // Laranja
  "#6366F1", // Indigo
  "#E11D48", // Vermelho Escuro
];

// Função utilitária para pegar o último dia disponível
function getLastDateKey(obj: Record<string, unknown>) {
  const keys = Object.keys(obj);
  return keys.sort().at(-1) ?? "";
}

// Função utilitária para pegar os dados de um período
function getDataByPeriod(
  obj: Record<string, unknown>,
  start: string,
  end: string,
): unknown[] {
  const keys = Object.keys(obj)
    .filter((date) => date >= start && date <= end)
    .sort();
  return keys.map((date) => (obj as Record<string, unknown[]>)[date]).flat();
}

// Função utilitária para pegar os últimos N dias disponíveis
function getLastNDates(obj: Record<string, unknown>, n: number) {
  const keys = Object.keys(obj).sort();
  return keys.slice(-n);
}

// Função para somar counts por nome
function sumByName(arr: { name: string; count: number }[]) {
  const map = new Map<string, number>();
  arr.forEach((item) => {
    map.set(item.name, (map.get(item.name) ?? 0) + item.count);
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// Novo range: de azul escuro (#001a33) até azul claro (#3B9ADB)
function getBlueShade(value: number, min: number, max: number) {
  const ratio = (value - min) / Math.max(1, max - min);
  // Azul escuro: r=0, g=26, b=51
  // Azul claro:  r=59, g=154, b=219
  const r = Math.round(0 + ratio * (59 - 0));
  const g = Math.round(26 + ratio * (154 - 26));
  const b = Math.round(51 + ratio * (219 - 51));
  return `rgb(${r},${g},${b})`;
}

async function fetchCriticalCategories(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await $fetch<Record<string, unknown>>(
      `http://localhost:8080/critical_categories`,
    );

    let data: { name: string; count: number }[] = [];
    if (params?.start_date && params?.end_date) {
      data = getDataByPeriod(res, params.start_date, params.end_date) as {
        name: string;
        count: number;
      }[];
      data = sumByName(data); // soma por nome
    } else {
      const lastDate = getLastDateKey(res);
      data = (res[lastDate] as { name: string; count: number }[]) ?? [];
    }

    // Calcula min/max para escala
    const counts = data.map((c) => c.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    CriticalCategoriesData.value = {
      labels: data.map((c) => c.name),
      datasets: [
        {
          label: "Categorias Críticas",
          data: data.map((c) => c.count),
          backgroundColor: data.map((c) => getBlueShade(c.count, min, max)),
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[2] ?? ""}`,
    });
  }
}

async function fetchCriticalProjects(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await $fetch<Record<string, unknown>>(
      `http://localhost:8080/critical_projects`,
    );

    let data: { id: string; name: string; count: number }[] = [];
    if (params?.start_date && params?.end_date) {
      const rawData = getDataByPeriod(
        res,
        params.start_date,
        params.end_date,
      ) as { id: string; name: string; count: number }[];
      // soma por id e nome
      const map = new Map<
        string,
        { id: string; name: string; count: number }
      >();
      rawData.forEach((item) => {
        const key = item.id + item.name;
        if (!map.has(key))
          map.set(key, { id: item.id, name: item.name, count: 0 });
        map.get(key)!.count += item.count;
      });
      data = Array.from(map.values());
    } else {
      const lastDate = getLastDateKey(res);
      data =
        (res[lastDate] as { id: string; name: string; count: number }[]) ?? [];
    }

    CriticalProjectsData.value = {
      labels: data.map((c) => formatLabel(c.name, 18).join(" ")),
      datasets: [
        {
          label: "Projetos Críticos",
          data: data.map((c) => c.count ?? 0),
          borderWidth: 1,
          backgroundColor: colors[0],
        },
      ],
    };
  } catch (error) {
    console.error(error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[1] ?? ""}`,
    });
  }
}

async function fetchTicketsByCategory(params?: {
  start_date?: string;
  end_date?: string;
}) {
  try {
    const res = await $fetch<Record<string, unknown>>(
      `http://localhost:8080/tickets_evolution`,
    );

    let dateKeys: string[] = [];
    if (params?.start_date && params?.end_date) {
      dateKeys = Object.keys(res)
        .filter(
          (date) =>
            params?.start_date !== undefined &&
            params?.end_date !== undefined &&
            date >= params.start_date &&
            date <= params.end_date,
        )
        .sort();
    } else {
      // Últimos 7 dias por padrão
      dateKeys = getLastNDates(res, 7);
    }

    // Agrupa os dados por name
    const nameSet = new Set<string>();
    dateKeys.forEach((date) => {
      (res[date] as { name: string }[]).forEach((item) =>
        nameSet.add(item.name),
      );
    });
    const names = Array.from(nameSet);

    // Para cada name, pega os counts dos dias
    const datasets = names.map((name, idx) => ({
      label: name,
      data: dateKeys.map((date) => {
        const found = (res[date] as { name: string; count: number }[]).find(
          (item) => item.name === name,
        );
        return found ? found.count : 0;
      }),
      borderColor: colors[idx % colors.length],
      backgroundColor: colors[idx % colors.length],
      fill: false,
    }));

    TicketsByCategoryData.value = {
      labels: dateKeys,
      datasets,
    };
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    toast.add({
      title: `Erro ao carregar dados do gráfico: ${dashNameList[0] ?? ""}`,
    });
  }
}

function onRangeUpdate(payload: { start_date: string; end_date: string }) {
  fetchCriticalCategories(payload);
  fetchCriticalProjects(payload);
  fetchTicketsByCategory(payload);
}

// Ao iniciar, mostra os últimos 7 dias
fetchCriticalCategories();
fetchCriticalProjects();
fetchTicketsByCategory();

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
  fetchTicketsByCategory();
  fetchCriticalProjects();
  fetchCriticalCategories();
});
</script>
