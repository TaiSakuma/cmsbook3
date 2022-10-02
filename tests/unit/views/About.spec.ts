import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import About from "@/views/About.vue";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("About.vue", () => {
  let localVue;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    wrapper = mount(About, {
      localVue,
    });
  });

  it("test text", () => {
    expect(wrapper.text()).toBe("This is an about page");
  });

  it("test html", () => {
    expect(wrapper.html()).toContain("<h1>This is an about page</h1>");
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
