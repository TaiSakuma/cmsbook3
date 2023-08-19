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
import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useRoute } from "vue-router";

import { useSetTitle } from "./set-title";
import { useDarkMode } from "./dark-mode";

import AppBar from "./AppBar.vue";
import NavigationDrawer from "@/components/NavigationDrawer.vue";

useSetTitle();
useDarkMode();

const { mobile } = useDisplay();

const drawer = ref(true);
watchEffect(() => {
  drawer.value = !mobile.value;
});
function toggleDrawer() {
  drawer.value = !drawer.value;
}

const order = computed(() => (mobile.value ? 0 : -1));

const route = useRoute();
</script>
