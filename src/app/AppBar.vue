<template>
  <v-app-bar comment="fallthrough attributes">
    <template v-slot:prepend>
      <slot name="prepend" comment="slot for v-app-bar-nav-icon"> </slot>
    </template>
    <template v-slot:title>
      <router-link
        to="/"
        v-text="title"
        class="text-primary font-weight-medium text-decoration-none"
      >
      </router-link>
    </template>
    <template v-slot:append>
      <v-tooltip left open-delay="800">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="toggleDark()">
            <v-icon>mdi-invert-colors</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark mode</span>
      </v-tooltip>
    </template>
    <template v-slot:extension>
      <TopNavi></TopNavi>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useStore } from "@/stores/main";
import { useDarkMode } from "./dark-mode";

import TopNavi from "@/components/TopNavi.vue";

const store = useStore();
const { title } = storeToRefs(store);

const { toggleDark } = useDarkMode();
</script>
