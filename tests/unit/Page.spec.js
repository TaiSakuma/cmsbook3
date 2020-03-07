import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import moxios from "moxios";

import $ from "jquery";

import Page from "@/views/Page.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("Page.vue", () => {
  const ENV_ORG = process.env;
  const $_ORG = global.$;
  const MathJax_ORG = global.MathJax;

  let localVue;
  let router;
  let wrapper;
  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    global.$ = $;
    global.MathJax = { typeset: jest.fn() };
    moxios.install();
    localVue = createLocalVue();
    router = new VueRouter();

    wrapper = mount(Page, {
      localVue,
      router,
      mocks: {
        $route: {
          path: "/chapter-A/section-b/page-3.md",
          params: {
            chapter: "chapter-A",
            section: "section-b",
            page: "page-3.md"
          }
        }
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
    global.MathJax = MathJax_ORG;
    global.$ = $_ORG;
    process.env = ENV_ORG;
  });

  it("server URL", () => {
    expect(wrapper.vm.path).toBe(
      "http://localhost/cmsbook/chapter-A/section-b/page-3.md"
    );
  });

  it("axios request ", done => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/chapter-A/section-b/page-3.md"
      );
      expect(request.config.method).toBe("get");
      expect(request.config.data).toBeUndefined();
      done();
    });
  });

  it("snapshot", done => {
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: "**marked**"
      });
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("marked", done => {
    console.log(wrapper.vm.path);
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: "**marked**"
      });
      expect(wrapper.html()).toContain("<strong>marked</strong>");
      done();
    });
  });

  it("404", done => {
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 404
      });
      expect(wrapper.text()).toContain("Error: cannot get");
      done();
    });
  });

  it("test text", done => {
    console.log(wrapper.vm.path);
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();

      await request.respondWith({
        status: 200,
        response: "**marked**"
      });

      console.log(request.config);
      console.log(wrapper.html());
      done();
    });
  });
});
