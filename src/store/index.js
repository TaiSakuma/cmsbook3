import Vue from "vue";
import Vuex from "vuex";

import { get_title } from "@/cmsbook3-retrieve";

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
      const title = await get_title();
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
