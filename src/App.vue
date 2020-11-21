<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <SideNavi></SideNavi>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none; color: inherit;">{{ $store.state.title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ on }">
          <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark" v-on="on">
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
import SideNavi from "@/components/SideNavi";
import TopNavi from "@/components/TopNavi";

export default {
  name: "App",
  components: {
    SideNavi,
    TopNavi
  },
  metaInfo() {
    const title= this.$store.state.title;
    return {
      title: title,
      titleTemplate: "%s | " + title
    };
  },
  data: () => ({
    drawer: null
  }),
  mounted() {
    this.$vuetify.theme.dark = localStorage.dark === "true";
    this.$store.dispatch("loadTitle");
    this.$store.dispatch("loadChapters");
  },
  watch: {
    "$vuetify.theme.dark": function(v) {
      localStorage.dark = v;
    }
  }
};
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
