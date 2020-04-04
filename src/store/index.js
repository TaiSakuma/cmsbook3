import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

const state = {
  title: "cmsbook",
};

export const mutations = {
  set_title(state, title) {
    state.title = title;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions: {
    async loadTitle({ commit }) {
      const configUrl =
        process.env.VUE_APP_CMSBOOK_URL + "/.cmsbook3/title.json";
      try {
        const response = await axios.get(configUrl);
        if (response.data.title == undefined) {
          throw "title undefined";
        }
        const title = response.data.title;
        commit("set_title", title);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
