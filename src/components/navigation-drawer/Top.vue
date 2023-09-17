<template>
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

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";

const store = useStore();
const { chapter } = storeToRefs(store);
</script>
