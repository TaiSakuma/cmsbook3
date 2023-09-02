<template>
  <v-navigation-drawer comment="fallthrough attributes">
    <template v-slot:prepend>
      <div class="pa-4">
        <router-link
          v-if="chapter"
          :to="chapter.path"
          style="text-decoration: none; color: inherit"
        >
          {{ chapter.name }}
        </router-link>
      </div>
    </template>
    <v-fade-transition leave-absolute>
      <list :key="chapter.path" v-if="chapter"></list>
    </v-fade-transition>
    <template v-slot:append>
      <div class="ma-4 d-flex justify-space-around align-center">
        <toggle-dark-mode-button></toggle-dark-mode-button>
        <span class="text-secondary text-body-2">v{{ packageVersion }}</span>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";

import List from "./List.vue";
import ToggleDarkModeButton from "@/components/ToggleDarkModeButton.vue";

const store = useStore();
const { packageVersion, chapter } = storeToRefs(store);
</script>
