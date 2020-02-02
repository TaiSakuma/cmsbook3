import Vue from "vue";
import VueRouter from "vue-router";
import Page from "../views/Page.vue";
import Redirect from "../views/Redirect.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/references/SUSY/web.md"
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/:chapter/*.pdf",
    name: "redirect",
    component: Redirect
  },
  {
    path: "/:chapter/:section/:page",
    name: "page",
    component: Page
  },
  {
    path: "/:chapter/:section",
    name: "section",
    component: Page
  },
  {
    path: "/:chapter",
    name: "chapter",
    component: Page
  },
  {
    path: "*",
    name: "pagenotfound",
    component: PageNotFound
  }
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
  }
});

export default router;
