import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";

import moxios from "moxios";

import { storeConfig } from "@/store/index.js";

describe("store", () => {
  const ENV_ORG = process.env;
  let localVue;
  let store;

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    moxios.install();
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  afterEach(() => {
    moxios.uninstall();
    process.env = ENV_ORG;
  });

  it("commit set_title", () => {
    expect(store.state.title).toBe("cmsbook");
    store.commit("set_title", "new title");
    expect(store.state.title).toBe("new title");
  });

  it("dispatch loadTitle url", async (done) => {
    expect(store.state.title).toBe("cmsbook");
    store.dispatch("loadTitle");
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/.cmsbook3/title.json"
      );
      done();
    });
  });

  it("dispatch loadTitle success", async (done) => {
    expect(store.state.title).toBe("cmsbook");
    store.dispatch("loadTitle");
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: {
          title: "new title",
        },
      });
      expect(store.state.title).toBe("new title");
      done();
    });
  });

  it("dispatch loadTitle error", async (done) => {
    expect(store.state.title).toBe("cmsbook");
    store.dispatch("loadTitle");
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: {},
      });
      expect(store.state.title).toBe("cmsbook");
      done();
    });
  });
});
