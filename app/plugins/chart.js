// plugins/chart.ts
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

export default defineNuxtPlugin(() => {
  // Registra os módulos necessários do Chart.js
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement, // <- necessário para gráficos de linha
    PointElement, // <- necessário para pontos (scatter/line)
    CategoryScale,
    LinearScale,
    ArcElement,
    ChartDataLabels,
  );
});
