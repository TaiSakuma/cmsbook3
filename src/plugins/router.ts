import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

import Page from "@/views/page/Page.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import HomeView from "@/views/HomeView.vue";
import ChapterView from "@/views/ChapterView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/:chapter",
    name: "chapter",
    component: ChapterView,
  },
  {
    path: "/:chapter/:section/:page*",
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
