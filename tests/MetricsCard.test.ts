import { mount } from "@vue/test-utils";
import MetricsCard from "../app/components/MetricsCard.vue";

describe("MetricsCard", () => {
  it("renders correctly", () => {
    const wrapper = mount(MetricsCard);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders value when passed as prop", () => {
    const wrapper = mount(MetricsCard, {
      props: { tituloMetrica: "Test Title", valorMetrica: 42 },
    });
    expect(wrapper.text()).toContain("42");
  });

  it("emits click event when clicked", async () => {
    const wrapper = mount(MetricsCard);
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
