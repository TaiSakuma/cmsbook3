import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "cmsbook"
  },
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
        commit("SET_TITLE", title);
      } catch (error) {
        console.log(error);
      }

    }
  },
  mutations: {
    SET_TITLE(state, title) {
      state.title = title;
    }
  }
});
