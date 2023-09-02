<template>
  <div class="page">
    <breadcrumbs></breadcrumbs>
    <div outlined max-width="980" class="ma-3 pa-3">
      <div ref="markdownBody" class="markdown-body" v-html="content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useContent } from "./content";
import { usePrism } from "./prism";
import { useMathJax } from "./mathjax";

import Breadcrumbs from "./breadcrumbs/Breadcrumbs.vue";

const markdownBody = ref<HTMLElement>();
const { content } = useContent();

usePrism(markdownBody);
useMathJax(markdownBody);
</script>

<style>
/* .v-application .markdown-body code:before {
  content: "";
} */
</style>
