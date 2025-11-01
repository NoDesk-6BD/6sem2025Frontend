// tests/DashBase.test.ts
import { mount } from "@vue/test-utils";
import DashBase from "../app/components/DashBase.vue";

describe("DashBase", () => {
  it("renders correctly", () => {
    // Adicione as props que seu componente espera
    const wrapper = mount(DashBase, {
      props: {
        dashName: "Nome do Dash",
        titleStyle: "font-bold",
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
