<template>
  <div class="ma-4 d-flex justify-space-around align-center">
    <toggle-dark-mode-button></toggle-dark-mode-button>
    <span class="text-secondary text-body-2">v{{ packageVersion }}</span>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";

import ToggleDarkModeButton from "@/components/ToggleDarkModeButton.vue";

const store = useStore();
const { packageVersion } = storeToRefs(store);
</script>
