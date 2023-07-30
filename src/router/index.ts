import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

import { retrieveFrom } from "@/cmsbook3-retrieve";

import Page from "@/views/Page.vue";
import PageNotFound from "@/views/PageNotFound.vue";

interface Home {
  home?: string;
}

async function getPathToHome() {
  const defaultHome = "index/web.md";
  try {
    const data = await retrieveFrom<Home>("/.cmsbook3/home.json");
    if (data.home == undefined) {
      throw "home undefined";
    }
    return data.home;
  } catch {
    return defaultHome;
  }
}

async function getPathToChapterHome(chapter: string) {
  const defaultHome = "index/web.md";
  try {
    const data = await retrieveFrom<Home>(`/${chapter}/.cmsbook3/home.json`);
    if (data.home == undefined) {
      throw "home undefined";
    }
    return data.home;
  } catch {
    return defaultHome;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => null,
    beforeEnter: async (to, from, next) => {
      const relPath = await getPathToHome();
      const path = to.path + relPath;
      next(path);
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/:chapter/:section",
    redirect: (to) => {
      const pathChapterSection = to.path;
      // e.g. /abc/xyz

      const defaultPage = import.meta.env.VITE_CMSBOOK_INDEX_FILENAME;
      // e.g. web.md

      const ret = `${pathChapterSection}/${defaultPage}`;
      // e.g., /abc/xyz/web.md

      return ret;
    },
  },
  {
    path: "/:chapter",
    component: () => null,
    beforeEnter: async (to, from, next) => {
      const maybeChapter = to.params.chapter;
      const chapter =
        typeof maybeChapter === "string" ? maybeChapter : maybeChapter[0];
      const relPath = await getPathToChapterHome(chapter);
      const path = `/${to.params.chapter}/${relPath}`;
      next(path);
    },
  },
  {
    path: "/:chapter/:section/:page+",
    name: "page",
    component: Page,
  },
  {
    path: "/*",
    name: "pagenotfound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

export default router;
