import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";

import {
  Path,
  getTitle,
  getChapters,
  getSectionsInChapter,
} from "@/cmsbook3-retrieve";

export const useStore = defineStore("main", () => {
  const title = ref("");
  watchEffect(async () => {
    title.value = await getTitle();
  });

  const chapters = ref<Path[]>([]);
  watchEffect(async () => {
    chapters.value = await getChapters();
  });
  return {
    title,
    chapters,
  };
});
