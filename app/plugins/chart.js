/* plugins/chart.js */
/* import { defineNuxtPlugin } from '#app' */
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
  Filler,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";

export default defineNuxtPlugin(() => {
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Filler,
    ChartDataLabels,
    annotationPlugin,
  );
});
