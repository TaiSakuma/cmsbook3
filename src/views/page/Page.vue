<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <div outlined max-width="980" class="ma-3 pa-3">
      <div class="markdown-body" v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUpdated } from "vue";
import { useRoute } from "vue-router";

// import Prism from 'prism-es6'; // Jest doesn't work with this
import Prism from "prismjs";
import "prism-es6/components/prism-markup-templating";
import "prism-es6/components/prism-python";
import "prism-es6/components/prism-bash";
import "prism-es6/components/prism-latex";
import "@/prism.css";

import { useContent } from "./content";

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

onUpdated(() => {
  Prism.highlightAll();
  try {
    MathJax.Hub.Typeset();
  } catch (error) {
    console.log(error);
  }
});
</script>

<style>
/* .v-application .markdown-body code:before {
  content: "";
} */
</style>
