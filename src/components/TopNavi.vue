<template>
  <v-tabs optional align-with-title background-color="transparent">
    <v-tab
      v-for="chapter in chapters"
      :key="chapter.name"
      :to="chapter.path"
      v-text="chapter.name"
      class="no-uppercase"
    ></v-tab>
    <v-tab to="/" v-show="false">
      <!-- to hide v-tabs-slider when none is selected -->
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
const store = useStore();
const { chapters } = storeToRefs(store);
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
