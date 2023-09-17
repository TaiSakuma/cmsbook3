<template>
  <v-app>
    <navigation-drawer v-model="drawer"></navigation-drawer>
    <app-bar :order="order">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="toggleDrawer" v-if="mobile">
        </v-app-bar-nav-icon>
      </template>
    </app-bar>
    <v-main>
      <router-view v-slot="{ Component, route }">
        <v-fade-transition leave-absolute>
          <component :key="route.fullPath" :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

import { useColorTheme } from "@/utils/color-theme";
import { useSetTitle } from "./set-title";
import { useDrawer } from "./drawer";

import AppBar from "./AppBar.vue";
import NavigationDrawer from "@/components/navigation-drawer/NavigationDrawer.vue";

useSetTitle();
useColorTheme();
const { mobile } = useDisplay();
const { drawer, toggleDrawer, order } = useDrawer();
</script>

<style scoped>
.v-main {
  height: calc(100% - var(--v-layout-top));
  /* --v-layout-top is the height of the app bar */
  overflow-y: scroll;
}
</style>
