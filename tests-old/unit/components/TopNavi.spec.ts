import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import TopNavi from "@/components/TopNavi.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("TopNavi.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let router;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    router = new VueRouter();

    actions = {};
    store = new Vuex.Store({
      actions,
      state: {
        chapters: [
          { name: "Chapter A", path: "/chapter-A" },
          { name: "Chapter B", path: "/chapter-B" },
          { name: "Chapter C", path: "/chapter-C" },
        ],
      },
    });

    wrapper = shallowMount(TopNavi, {
      localVue,
      router,
      store,
    });
  });

  afterEach(() => {
    process.env = ENV_ORG;
  });

  it("snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
