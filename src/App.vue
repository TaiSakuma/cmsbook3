<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <SideNavi></SideNavi>
    </v-navigation-drawer>
    <v-app-bar app dense clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>cmsbook</v-toolbar-title>
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
    <v-content>
      <transition name="fade" mode="out-in">
        <router-view
          :key="
            $route.params.chapter + $route.params.section + $route.params.page
          "
        ></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import SideNavi from "./components/SideNavi";
import TopNavi from "./components/TopNavi";

export default {
  name: "App",

  components: {
    SideNavi,
    TopNavi
  },

  data: () => ({
    drawer: null
  })
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
