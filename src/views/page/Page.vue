<template>
  <div class="page">
    <breadcrumbs></breadcrumbs>
    <div outlined max-width="980" class="ma-3 pa-3">
      <div class="markdown-body" v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContent } from "./content";
import { usePrism } from "./prism";
import { useMathJax } from "./mathjax";

import Breadcrumbs from "./breadcrumbs/Breadcrumbs.vue";

const { content } = useContent();

usePrism();
useMathJax();
</script>

<style>
/* .v-application .markdown-body code:before {
  content: "";
} */
</style>
