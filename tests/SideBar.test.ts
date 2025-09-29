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
