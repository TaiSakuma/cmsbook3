import Vue from "vue";
import { createPinia, PiniaVuePlugin } from 'pinia';
import App from "./App.vue";
import router from "./router";
import store from './store'
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(PiniaVuePlugin);

const pinia = createPinia();

new Vue({
  router,
  store,
  pinia,
  vuetify,
  render: h => h(App)
}).$mount("#app");
