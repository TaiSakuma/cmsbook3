<template>
  <v-navigation-drawer comment="fallthrough attributes">
    <template v-slot:prepend>
      <top></top>
    </template>
    <v-fade-transition leave-absolute>
      <list :key="chapter.path" v-if="chapter"></list>
    </v-fade-transition>
    <template v-slot:append>
      <bottom></bottom>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";

import Top from "./Top.vue";
import List from "./List.vue";
import Bottom from "./Bottom.vue";

const store = useStore();
const { chapter } = storeToRefs(store);
</script>
