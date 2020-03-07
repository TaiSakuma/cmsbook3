import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import moxios from "moxios";

import TopNavi from "@/components/TopNavi.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

describe("TopNavi.vue", () => {
  const ENV_ORG = process.env;

  let localVue;
  let router;
  let wrapper;

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    moxios.install();
    localVue = createLocalVue();
    router = new VueRouter();

    wrapper = shallowMount(TopNavi, {
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
    process.env = ENV_ORG;
  });

  const response = {
    chapters: [
      { name: "Chapter A", path: "/chapter-A" },
      { name: "Chapter B", path: "/chapter-B" },
      { name: "Chapter C", path: "/chapter-C" }
    ]
  };

  it("snapshot", done => {
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: response
      });
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });

  it("axios request ", done => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/.cmsbook3/chapters.json"
      );
      expect(request.config.method).toBe("get");
      expect(request.config.data).toBeUndefined();
      done();
    });
  });

});
