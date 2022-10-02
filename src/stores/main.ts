import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";

import {
  Path,
  getTitle,
  getChapters,
  getSectionsInChapter,
} from "@/cmsbook3-retrieve";

export const useStore = defineStore("main", () => {
  const chapters = ref<Path[]>([]);
  watchEffect(async () => {
    chapters.value = await getChapters();
  });
  return {
    chapters,
  };
});
