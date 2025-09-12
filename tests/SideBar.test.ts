import { mount } from "@vue/test-utils";
import SideBar from "../app/components/SideBar.vue";

test("renders Dashboard when not collapsed", () => {
  const wrapper = mount(SideBar);
  expect(wrapper.text()).toContain("Dashboard");
});

test("renders Logout when not collapsed", () => {
  const wrapper = mount(SideBar);
  expect(wrapper.text()).toContain("Logout");
});

test("hides Logout when collapsed", async () => {
  const wrapper = mount(SideBar);
  await wrapper.find("button").trigger("click");
  expect(wrapper.text()).not.toContain("Logout");
});

test("renders dashboard icon", () => {
  const wrapper = mount(SideBar);
  expect(wrapper.html()).toContain("📊");
});

test("renders logout icon", () => {
  const wrapper = mount(SideBar);
  expect(wrapper.html()).toContain("🔒");
});

test("toggles collapsed state twice", async () => {
  const wrapper = mount(SideBar);
  const button = wrapper.find("button");
  await button.trigger("click"); // collapse
  expect(wrapper.text()).not.toContain("Dashboard");
  await button.trigger("click"); // expand
  expect(wrapper.text()).toContain("Dashboard");
});
