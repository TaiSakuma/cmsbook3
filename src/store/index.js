import Vue from "vue";
import Vuex from "vuex";

import { getTitle, getChapters } from "@/cmsbook3-retrieve";

Vue.use(Vuex);

const state = {
  title: "cmsbook",
  chapters: [] // e.g., [{ name: "Chapter A", path: "/chapter-A" }]
};

const mutations = {
  set_title(state, title) {
    state.title = title;
  },
  set_chapters(state, chapters) {
    state.chapters = chapters
  }
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
  async loadChapters({ commit }) {
    try {
      const chapters = await getChapters();
      commit("set_chapters", chapters);
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
