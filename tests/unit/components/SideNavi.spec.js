import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import moxios from "moxios";

import SideNavi from "@/components/SideNavi.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("SideNavi.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let router;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    moxios.install();
    localVue = createLocalVue();
    localVue.use(Vuex);
    router = new VueRouter();

    actions = {};
    store = new Vuex.Store({
      actions,
      getters: {
        chapterMap: () => {
          return { "/chapter-A": { name: "Chapter A", path: "/chapter-A" } };
        },
      },
    });

    wrapper = shallowMount(SideNavi, {
      localVue,
      router,
      store,
      mocks: {
        $route: {
          path: "/chapter-A/section-b/page-3.md",
          params: {
            chapter: "chapter-A",
            section: "section-b",
            page: "page-3.md",
          },
        },
      },
    });
  });

  afterEach(() => {
    moxios.uninstall();
    process.env = ENV_ORG;
  });

  const response = {
    sections: [
      { name: "Inbox", path: "index/inbox.md" },
      {
        name: "A",
        subcontents: [
          { name: "a1", path: "a1" },
          { name: "a2", path: "a2" },
        ],
      },
      {
        name: "B",
        subcontents: [
          {
            name: "b1",
            subcontents: [
              { name: "b11", path: "b11" },
              { name: "b12", path: "b12" },
            ],
          },
          { name: "b2", path: "b2" },
        ],
      },
    ],
  };

  it("snapshot", (done) => {
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: response,
      });
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("axios request ", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/chapter-A/.cmsbook3/sections.json"
      );
      expect(request.config.method).toBe("get");
      expect(request.config.data).toBeUndefined();
      done();
    });
  });
});
