<template></template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLoadFrom } from "@/utils/cmsbook3";

interface Home {
  home?: string;
}

const route = useRoute();
const router = useRouter();

async function getPathToChapterHome(chapter: string) {
  const { loadFrom } = useLoadFrom();
  const defaultHome = "index/web.md";
  try {
    const data = await loadFrom<Home>(`/${chapter}/.cmsbook3/home.json`);
    if (data.home == undefined) {
      throw "home undefined";
    }
    return data.home;
  } catch {
    return defaultHome;
  }
}

onBeforeMount(async () => {
  const maybeChapter = route.params.chapter;
  const chapter =
    typeof maybeChapter === "string" ? maybeChapter : maybeChapter[0];
  const relPath = await getPathToChapterHome(chapter);
  const path = `/${route.params.chapter}/${relPath}`;
  router.push(path);
});
</script>
