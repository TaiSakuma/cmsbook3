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
    <template v-slot:append> </template>
    <template v-slot:extension>
      <TopNavi></TopNavi>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";
import TopNavi from "@/components/TopNavi.vue";
const store = useStore();
const { title } = storeToRefs(store);
</script>
