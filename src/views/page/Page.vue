<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <div outlined max-width="980" class="ma-3 pa-3">
      <div class="markdown-body" v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useContent } from "./content";
import { usePrism } from "./prism";
import { useMathJax } from "./mathjax";

const route = useRoute();

const { content } = useContent();

const breadcrumbsItems = computed(() => {
  let ret = [{ title: route.params.chapter }];
  if (route.params.section) {
    ret.push({ title: route.params.section });
  }
  if (Array.isArray(route.params.page)) {
    route.params.page.forEach((e) => {
      ret.push({ title: e });
    });
  } else if (route.params.page) {
    ret.push({ title: route.params.page });
  }
  return ret;
});

usePrism();
useMathJax();
</script>

<style>
/* .v-application .markdown-body code:before {
  content: "";
} */
</style>
