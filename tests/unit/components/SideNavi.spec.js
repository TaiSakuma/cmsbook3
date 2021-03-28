import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import SideNavi from "@/components/SideNavi.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("SideNavi.vue", () => {
  const ENV_ORG = process.env;
  let localVue;
  let router;

  const sections = [
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
  ];

  function createWrapper() {
    let actions = {
      onChangePage: jest.fn(),
    };
    let store = new Vuex.Store({
      actions,
      state: {
        sectionsInCurrentChapter: sections,
      },
      getters: {
        chapterMap: () => {
          return { "/chapter-A": { name: "Chapter A", path: "/chapter-A" } };
        },
        currentChapter: () => {
          return { name: "Chapter A", path: "/chapter-A" };
        },
      },
    });

    return shallowMount(SideNavi, {
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
      stubs: ["router-link", "router-view"],
    });
  }

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    localVue = createLocalVue();
    localVue.use(Vuex);
    router = new VueRouter();
  });

  afterEach(() => {
    // moxios.uninstall();
    process.env = ENV_ORG;
  });

  it("snapshot", async () => {
    let wrapper = createWrapper();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
