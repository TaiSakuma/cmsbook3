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

async function getPathToHome() {
  const { loadFrom } = useLoadFrom();
  const defaultHome = "index/web.md";
  try {
    const data = await loadFrom<Home>("/.cmsbook3/home.json");
    if (data.home == undefined) {
      throw "home undefined";
    }
    return data.home;
  } catch {
    return defaultHome;
  }
}

onBeforeMount(async () => {
  const relPath = await getPathToHome();
  const path = route.path + relPath;
  router.push(path);
});
</script>
