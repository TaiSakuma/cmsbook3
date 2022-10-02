<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <SideNavi></SideNavi>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none; color: inherit">
          {{ title }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            @click="$vuetify.theme.dark = !$vuetify.theme.dark"
            v-on="on"
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
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view :key="$route.path"></router-view>
      </transition>
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
      drawer: ref(null),
    };
  },
  mounted() {
    this.$vuetify.theme.dark = localStorage.dark === "true";
    this.$store.dispatch("loadTitle");
    this.$store.dispatch("loadChapters");
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
