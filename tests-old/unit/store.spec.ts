import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";

import { storeConfig } from "@/store/index.js";

import retrieve from "@/cmsbook3-retrieve";

jest.mock("@/cmsbook3-retrieve");

describe("store", () => {
  let localVue;
  let store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Vuex.Store(cloneDeep(storeConfig));
  });

  it("commit set_title", () => {
    expect(store.state.title).toBe("cmsbook");
    store.commit("set_title", "new title");
    expect(store.state.title).toBe("new title");
  });

  it("dispatch loadTitle success", async () => {
    expect(store.state.title).toBe("cmsbook");
    // @ts-ignore
    retrieve.getTitle.mockResolvedValue("new title");
    await store.dispatch("loadTitle");
    expect(store.state.title).toBe("new title");
  });

  it("dispatch loadTitle error", async () => {
    expect(store.state.title).toBe("cmsbook");
    // @ts-ignore
    retrieve.getTitle.mockRejectedValueOnce("cannot get title");
    await store.dispatch("loadTitle");
    expect(store.state.title).toBe("cmsbook");
  });
});
