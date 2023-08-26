<template>
  <v-tabs v-model="tab" align-tabs="title">
    <v-tab :value="chapter.name" :to="chapter.path" v-for="chapter in chapters">
      <span class="text-none"> {{ chapter.name }} </span>
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";
const store = useStore();
const { chapters, chapter } = storeToRefs(store);
const tab = ref<string | null>(null);
watchEffect(() => {
  const value = chapter.value?.name;
  if (!value) return;
  tab.value = value;
});
</script>

<style scoped>
.v-tab--selected {
  color: var(--v-theme-primary);
}
</style>
