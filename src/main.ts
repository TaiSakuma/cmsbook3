import { createApp, h } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

const pinia = createPinia();

const app = createApp({
  render: () => h(App),
});
app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
