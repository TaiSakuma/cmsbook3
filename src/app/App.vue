<template>
  <v-app>
    <navigation-drawer v-model="drawer"></navigation-drawer>
    <v-app-bar dense :order="order">
      <v-app-bar-nav-icon @click="toggleDrawer" v-if="mobile">
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" style="text-decoration: none; color: inherit">
          {{ title }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="toggleDark()">
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
      <router-view :key="route.fullPath" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

import { useSetTitle } from "./set-title";
import { useDarkMode } from "./dark-mode";

import NavigationDrawer from "@/components/NavigationDrawer.vue";
import TopNavi from "@/components/TopNavi.vue";

useSetTitle();
const { toggleDark } = useDarkMode();

const store = useStore();
const { title } = storeToRefs(store);

const { mobile } = useDisplay();
const order = computed(() => (mobile.value ? 0 : -1));

const route = useRoute();
const drawer = ref(true);

watchEffect(() => {
  drawer.value = !mobile.value;
});

function toggleDrawer() {
  drawer.value = !drawer.value;
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
