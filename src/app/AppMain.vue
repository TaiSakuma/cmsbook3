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
      <router-view v-slot="{ Component }">
        <v-fade-transition>
          <component :key="route.fullPath" :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

import { useColorTheme } from "@/utils/color-theme";
import { useSetTitle } from "./set-title";
import { useDrawer } from "./drawer";

import AppBar from "./AppBar.vue";
import NavigationDrawer from "@/components/navigation-drawer/NavigationDrawer.vue";

useSetTitle();
useColorTheme();

const { mobile } = useDisplay();
const { drawer, toggleDrawer } = useDrawer();
const order = computed(() => (mobile.value ? 0 : -1));
const route = useRoute();
</script>
