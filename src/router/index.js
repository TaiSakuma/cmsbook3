import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Page from "../views/Page.vue";
import Redirect from "../views/Redirect.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/references/SUSY/web"
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
    path: "*",
    name: "pagenotfound",
    component: PageNotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
