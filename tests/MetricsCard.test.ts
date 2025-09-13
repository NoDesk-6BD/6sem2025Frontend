import { mount } from "@vue/test-utils";
import MetricsCard from "../app/components/MetricsCard.vue";

describe("MetricsCard", () => {
  it("renders correctly", () => {
    const wrapper = mount(MetricsCard);
    expect(wrapper.exists()).toBe(true);
  });
});
