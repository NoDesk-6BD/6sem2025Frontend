import { mount } from "@vue/test-utils";
import DashBase from "../app/components/DashBase.vue";

describe("DashBase", () => {
  it("renders correctly", () => {
    const wrapper = mount(DashBase);
    expect(wrapper.exists()).toBe(true);
  });
});
