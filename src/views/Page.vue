<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <v-card outlined max-width="980" class="ma-3 pa-3">
      <v-card-text class="markdown-body" v-html="content"></v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import $ from "jquery";

// import Prism from 'prism-es6'; // Jest doesn't work with this
import Prism from "prismjs";
import "prism-es6/components/prism-markup-templating";
import "prism-es6/components/prism-python";
import "prism-es6/components/prism-bash";
import "prism-es6/components/prism-latex";
import "@/prism.css";

import { retrieveFrom } from "@/cmsbook3-retrieve";

const route = useRoute();
const cmsbook_url = ref(import.meta.env.VITE_CMSBOOK_URL);
const md = ref("");

const path = computed(
  () =>
    `/${route.params.chapter}/${route.params.section}/${route.params.page.join(
      "/"
    )}`
);

const content = computed(() => {
  let htmlString: string;
  try {
    htmlString = marked.parse(md.value);
  } catch (error) {
    return "cannot parsed as markdown";
  }

  try {
    return editHtml(htmlString);
  } catch (error) {
    console.error(error);
    return htmlString;
  }
});

watch(
  path,
  async () => {
    await getMarkDownFromPath();
  },
  { immediate: true }
);

async function getMarkDownFromPath() {
  if (!path.value) {
    md.value = "";
    return;
  }
  try {
    md.value = await retrieveFrom(path.value);
  } catch (error) {
    md.value = "Error: cannot get: " + path.value;
  }
}

function editHtml(htmlString: string) {
  const pathToCurrentDir = cmsbook_url.value + route.path.match(/.*\//);
  const ret = editHtmlWithJQuery(htmlString, pathToCurrentDir);
  return ret;
}

function editHtmlWithJQuery(htmlString: string, pathToCurrentDir: string) {
  let tree = $(`<div>${htmlString}</div>`);
  tree.find("a:not([href^='#'])").attr("target", "_blank");

  tree
    .find(
      "a:not([href^='http:'],[href^='https:'],[href^='file:'],[href^='/'],[href^='#'])"
    )
    .each(function () {
      this.setAttribute(
        "href",
        this.getAttribute("href").replace(/^/, pathToCurrentDir)
      );
    });

  tree
    .find("img:not([src^='http:'],[src^='https:'],[src^='/'])")
    .each(function () {
      this.setAttribute(
        "src",
        this.getAttribute("src").replace(/^/, pathToCurrentDir)
      );
    });

  return tree.html();
}

const breadcrumbsItems = computed(() => {
  let ret = [{ title: route.params.chapter }];
  if (route.params.section) {
    ret.push({ title: route.params.section });
  }
  if (route.params.page) {
    route.params.page.forEach((e) => {
      ret.push({ title: e });
    });
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

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style>
@import "../../node_modules/github-markdown-css/github-markdown.css";

.markdown-body {
  /* box-sizing: border-box; */
  min-width: 200px;
  /* max-width: 980px; */
  /* border-radius: 10px; */
}

.v-application .markdown-body code {
  box-shadow: none;
  color: inherit;
}
.v-application .markdown-body code:before {
  content: "";
}

.theme--dark .markdown-body {
  color: #f5f5f5;
}

.theme--dark .markdown-body hr {
  background-color: #757575;
}

.theme--dark .markdown-body blockquote {
  border-left-color: #757575;
  color: #bdbdbd;
}

.theme--dark .markdown-body pre {
  background-color: #212121;
}

.theme--dark .markdown-body code {
  background-color: inherit;
  /* color: #f44336; */
}

.theme--light .markdown-body code {
  background-color: inherit;
}

.theme--light .markdown-body pre {
  background-color: #f6f8fa;
}

.theme--dark .markdown-body table td,
.theme--dark .markdown-body table th {
  border: 1px solid #616161;
}

.theme--dark .markdown-body table tr {
  background-color: #212121;
}

.theme--dark .markdown-body table tr:nth-child(2n) {
  background-color: #424242;
}
</style>
