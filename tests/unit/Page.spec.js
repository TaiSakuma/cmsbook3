import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, shallowMount, createLocalVue } from "@vue/test-utils";

import Page from "@/views/Page.vue";

Vue.use(Vuetify);
// Vue.use(VueRouter);

const localVue = createLocalVue();
// localVue.use(VueRouter);

describe("Page.vue", () => {
  let wrapper;
  let router;
  beforeEach(() => {
    router = new VueRouter();
    wrapper = shallowMount(Page, {
      localVue,
      router,
      mocks: {
        $route: {
          params: {
            chapter: "A",
            section: "a",
            page: "c.md"
          }
        }
      }
    });
  });

  it("test text", () => {
    console.log(wrapper.html());
    // expect(wrapper.text()).toBe("This is an about page");
  });
});
