import Vue from "vue";
import Vuex from "vuex";

import { getTitle } from "@/cmsbook3-retrieve";

Vue.use(Vuex);

const state = {
  title: "cmsbook",
};

const mutations = {
  set_title(state, title) {
    state.title = title;
  },
};

const actions = {
  async loadTitle({ commit }) {
    try {
      const title = await getTitle();
      commit("set_title", title);
    } catch (error) {
      console.log(error);
    }
  },
};

export const storeConfig = {
  state,
  mutations,
  actions,
};

export default new Vuex.Store(storeConfig);
