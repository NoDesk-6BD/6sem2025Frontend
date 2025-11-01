// tests/ChartTicketsByCategory.test.ts
import { mount } from "@vue/test-utils";
import ChartTicketsByCategory from "../app/components/ChartTicketsByCategory.vue";

describe("ChartTicketsByCategory", () => {
  it("renders correctly", () => {
    // Crie dados simulados
    const mockChartData = {
      labels: ["Dúvida", "Incidente", "Requisição"],
      datasets: [
        {
          label: "Tickets por Categoria",
          backgroundColor: "#42A5F5",
          data: [15, 7, 22],
        },
      ],
    };

    // Passe os dados como prop
    const wrapper = mount(ChartTicketsByCategory, {
      props: {
        chartData: mockChartData,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
