<template>
  <v-app>
    <v-app-bar dense>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none; color: inherit">
          {{ title }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon>mdi-invert-colors</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark mode</span>
      </v-tooltip>
      <template v-slot:extension>
        <TopNavi></TopNavi>
      </template>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" permanent>
      <side-navi></side-navi>
    </v-navigation-drawer>
    <v-main>
      <router-view :key="$route.path" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
import SideNavi from "@/components/SideNavi.vue";
import TopNavi from "@/components/TopNavi.vue";

export default defineComponent({
  name: "App",
  components: { SideNavi, TopNavi },
  setup() {
    const store = useStore();
    const { title } = storeToRefs(store);
    watchEffect(() => {
      document.title = title.value;
    });
    return {
      title,
      drawer: ref(true),
    };
  },
  mounted() {
    this.$vuetify.theme.dark = localStorage.dark === "true";
  },
  watch: {
    "$vuetify.theme.dark": function (v) {
      localStorage.dark = v;
    },
  },
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
