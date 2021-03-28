import Vue from "vue";
import Vuex from "vuex";

import { getTitle, getChapters } from "@/cmsbook3-retrieve";

Vue.use(Vuex);

const state = {
  title: "cmsbook",
  chapters: [], // e.g., [{ name: "Chapter A", path: "/chapter-A" }, ...]
  currentPagePath: { chapter: null, section: null, page: null },
};

const getters = {
  chapterMap: (state) => {
    // e.g., { "/chapter-A": { name: "Chapter A", path: "/chapter-A" }, ...}
    return state.chapters.reduce(
      (acc, cur) => ({ ...acc, [cur.path]: cur }),
      {}
    );
  },
  currentChapter: (state, getters) => {
    return getters.chapterMap[`/${state.currentPagePath.chapter}`];
  },
};

const mutations = {
  set_title(state, title) {
    state.title = title;
  },
  set_chapters(state, chapters) {
    state.chapters = chapters;
  },
  set_current_page_path(state, routeParams) {
    const { chapter, section, page } = routeParams;
    state.currentPagePath = { chapter, section, page };
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
  async loadChapters({ commit }) {
    try {
      const chapters = await getChapters();
      commit("set_chapters", chapters);
    } catch (error) {
      console.log(error);
    }
  },
  onChangePage({ commit }, routeParams) {
    commit("set_current_page_path", routeParams);
  },
};

export const storeConfig = {
  state,
  getters,
  mutations,
  actions,
};

export default new Vuex.Store(storeConfig);
