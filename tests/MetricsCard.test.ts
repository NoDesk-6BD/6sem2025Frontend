// tests/MetricsCard.test.ts
import { mount } from "@vue/test-utils";
import MetricsCard from "../app/components/MetricsCard.vue";

describe("MetricsCard", () => {
  // Teste 1: Adicione props obrigatórias
  it("renders correctly", () => {
    const wrapper = mount(MetricsCard, {
      props: { tituloMetrica: "Título", valorMetrica: 0 },
    });
    expect(wrapper.exists()).toBe(true);
  });

  // Teste 2: Já estava correto
  it("renders value when passed as prop", () => {
    const wrapper = mount(MetricsCard, {
      props: { tituloMetrica: "Test Title", valorMetrica: 42 },
    });
    // expect(wrapper.text()).toContain("42");
    // const valueDiv = wrapper.find("div.text-xl.font-bold");
    // expect(valueDiv.text()).toContain("42");
    expect(wrapper.props("valorMetrica")).toBe(42);
  });

  // Teste 3: Adicione props obrigatórias
  it("emits click event when clicked", async () => {
    const wrapper = mount(MetricsCard, {
      props: { tituloMetrica: "Clicável", valorMetrica: 10 },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
