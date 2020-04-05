import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

const state = {
  title: "cmsbook",
};

const mutations = {
  set_title(state, title) {
    state.title = title;
  },
};

async function get_title() {
  const configUrl = process.env.VUE_APP_CMSBOOK_URL + "/.cmsbook3/title.json";
  const response = await axios.get(configUrl);
  if (response.data.title == undefined) {
    throw "title not found";
  }
  return response.data.title;
}

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
