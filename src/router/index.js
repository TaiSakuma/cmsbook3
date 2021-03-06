import Vue from "vue";
import VueRouter from "vue-router";
import VueMeta from "vue-meta";

import axios from "axios";

import Page from "@/views/Page.vue";
import PageNotFound from "@/views/PageNotFound.vue";

Vue.use(VueRouter);
Vue.use(VueMeta);

async function getPathToHome() {
  const configUrl = process.env.VUE_APP_CMSBOOK_URL + "/.cmsbook3/home.json";
  const defaultHome = "index/web.md";
  try {
    const response = await axios.get(configUrl);
    if (response.data.home == undefined) {
      throw "home undefined";
    }
    return response.data.home;
  } catch {
    return defaultHome;
  }
}

async function getPathToChapterHome(chapter) {
  const configUrl = `${process.env.VUE_APP_CMSBOOK_URL}/${chapter}/.cmsbook3/home.json`;
  const defaultHome = "index/web.md";
  try {
    const response = await axios.get(configUrl);
    if (response.data.home == undefined) {
      throw "home undefined";
    }
    return response.data.home;
  } catch {
    return defaultHome;
  }
}

const routes = [
  {
    path: "/",
    beforeEnter: async (to, from, next) => {
      const relPath = await getPathToHome();
      const path = to.path + relPath;
      next(path);
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/:chapter/:section",
    redirect: (to) => {
      const pathChapterSection = to.path;
      // e.g. /abc/xyz

      const defaultPage = process.env.VUE_APP_CMSBOOK_INDEX_FILENAME;
      // e.g. web.md

      const ret = `${pathChapterSection}/${defaultPage}`;
      // e.g., /abc/xyz/web.md

      return ret;
    },
  },
  {
    path: "/:chapter",
    beforeEnter: async (to, from, next) => {
      const relPath = await getPathToChapterHome(to.params.chapter);
      const path = `/${to.params.chapter}/${relPath}`;
      next(path);
    },
  },
  {
    path: "/:chapter/:section/:page*",
    name: "page",
    component: Page,
  },
  {
    path: "*",
    name: "pagenotfound",
    component: PageNotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

export default router;
