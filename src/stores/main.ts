import { ref, computed, watchEffect, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineStore } from "pinia";

import {
  Path,
  Chapters,
  Sections,
  getTitle,
  getChapters,
  getSectionsInChapter,
} from "@/cmsbook3-retrieve";

export const useStore = defineStore("main", () => {
  const packageVersion = ref(import.meta.env.PACKAGE_VERSION || "vx.x.x");

  //
  const title = ref("");

  watchEffect(async () => {
    title.value = await getTitle();
  });

  //
  const chapters = ref<NonNullable<Chapters["chapters"]>>([]);

  watchEffect(async () => {
    chapters.value = await getChapters();
  });

  const chapterMap = computed(() => {
    type ChapterMap = { [key: string]: Path };
    return chapters.value.reduce(
      (a, c) => ({ ...a, [c.path]: c }),
      {} as ChapterMap
    );
  });

  //
  const sections = ref<NonNullable<Sections["sections"]>>([]);

  const route = ref(useRoute());
  const routeParamChapter = computed(() => route.value.params.chapter);
  const chapterPath = computed(() => `/${routeParamChapter.value}`);
  watch(
    chapterPath,
    async (value, oldValue) => {
      sections.value = await getSectionsInChapter(value);
    },
    { immediate: true }
  );
  // The watchEffect commented out below is in principle concise equivalent to
  // the watch above. However, this somehow gets triggered on every route
  // change, not just when the currentChapterPath changes.
  // watchEffect(async () => {
  //   sections.value = await getSectionsInChapter(currentChapterPath.value);
  // });

  const chapter = computed(() => chapterMap.value[chapterPath.value]);

  return {
    packageVersion,
    title,
    chapters,
    chapter,
    sections,
  };
});
