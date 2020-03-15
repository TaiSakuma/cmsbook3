import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import App from "@/App.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("App.vue", () => {
  let localVue;
  let vuetify;
  let router;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    vuetify = new Vuetify();
    router = new VueRouter();

    actions = {
      loadTitle: jest.fn()
    };
    store = new Vuex.Store({
      actions,
      state: {
        title: "cmsbook"
      }
    });

    wrapper = shallowMount(App, {
      localVue,
      vuetify,
      router,
      store,
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

  it("action loadTitle", () => {
    expect(actions.loadTitle).toHaveBeenCalled();
  });
});
