<template></template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfig } from "@/utils/config";

const route = useRoute();
const router = useRouter();
const { config } = useConfig();

onBeforeMount(async () => {
  const pathChapterSection = route.path;
  // e.g. /abc/xyz

  const defaultPage = config.value.indexFilename;
  // e.g. web.md

  const ret = `${pathChapterSection}/${defaultPage}`;
  // e.g., /abc/xyz/web.md

  router.push(ret);
});
</script>
