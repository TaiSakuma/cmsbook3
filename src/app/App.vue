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
          <v-btn v-bind="props" icon @click="toggleDarkMode">
            <v-icon>mdi-invert-colors</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark mode</span>
      </v-tooltip>
      <template v-slot:extension>
        <TopNavi></TopNavi>
      </template>
    </v-app-bar>
    <navigation-drawer v-model="drawer"></navigation-drawer>
    <v-main>
      <router-view :key="route.fullPath" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

import { useSetTitle } from "./set-title";

import NavigationDrawer from "@/components/NavigationDrawer.vue";
import TopNavi from "@/components/TopNavi.vue";

useSetTitle();

const store = useStore();
const { title } = storeToRefs(store);

const route = useRoute();
const drawer = ref(true);

const theme = useTheme();

onMounted(() => {
  theme.global.name.value = JSON.parse(localStorage.getItem("dark") || "false")
    ? "dark"
    : "light";
});

function toggleDarkMode() {
  theme.global.name.value =
    theme.global.name.value === "dark" ? "light" : "dark";
  localStorage.setItem(
    "dark",
    JSON.stringify(theme.global.name.value === "dark")
  );
}
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
