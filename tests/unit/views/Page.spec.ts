import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import $ from "jquery";

import * as retrieve from "@/cmsbook3-retrieve/retrieve.js";

import Page from "@/views/Page.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("Page.vue", () => {
  const ENV_ORG = process.env;
  // @ts-ignore
  const $_ORG = global.$;
  // @ts-ignore
  const MathJax_ORG = global.MathJax;

  let localVue;
  let router;

  function createWrapper() {
    return mount(Page, {
      localVue,
      router,
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
  }

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    // @ts-ignore
    global.$ = $;
    // @ts-ignore
    global.MathJax = { Hub: { Typeset: jest.fn() } };
    // @ts-ignore
    retrieve.retrieveFrom = jest.fn();
    localVue = createLocalVue();
    router = new VueRouter();
  });

  afterEach(() => {
    // @ts-ignore
    global.MathJax = MathJax_ORG;
    // @ts-ignore
    global.$ = $_ORG;
    process.env = ENV_ORG;
  });

  it("server URL", () => {
    const wrapper = createWrapper();
    // @ts-ignore
    expect(wrapper.vm.path).toBe("/chapter-A/section-b/page-3.md");
  });

  it("retrieveFrom path", () => {
    const wrapper = createWrapper();
    // @ts-ignore
    expect(retrieve.retrieveFrom.mock.calls).toEqual([
      ["/chapter-A/section-b/page-3.md"],
    ]);
  });

  it("snapshot", async () => {
    // @ts-ignore
    retrieve.retrieveFrom.mockResolvedValue("**marked**");
    const wrapper = createWrapper();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("marked", async () => {
    // @ts-ignore
    retrieve.retrieveFrom.mockResolvedValue("**marked**");
    const wrapper = createWrapper();
    await Vue.nextTick();
    await Vue.nextTick();
    expect(wrapper.html()).toContain("<strong>marked</strong>");
  });
});
