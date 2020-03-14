import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let router;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    router = new VueRouter();
    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      router,
      mocks: {
        $route: {
          path: "/A/b/3.md"
        }
      },
      stubs: ["router-link", "router-view"]
    });
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
