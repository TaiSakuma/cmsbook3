import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { cloneDeep } from "lodash";

import { storeConfig } from "@/store/index.js";

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
});
