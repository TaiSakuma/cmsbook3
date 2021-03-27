<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <v-card outlined max-width="980" class="ma-3 pa-3">
      <v-card-text class="markdown-body" v-html="content"></v-card-text>
    </v-card>
  </div>
</template>

<script>
import marked from "marked";

// import Prism from 'prism-es6'; // Jest doesn't work with this
import Prism from 'prismjs';
import "prism-es6/components/prism-markup-templating";
import "prism-es6/components/prism-python";
import "prism-es6/components/prism-bash";
import "prism-es6/components/prism-latex";
import "@/prism.css";

import { retrieveFrom } from "@/cmsbook3-retrieve";

export default {
  name: "page",
  data() {
    return {
      cmsbook_url: process.env.VUE_APP_CMSBOOK_URL,
      md: "",
    };
  },
  computed: {
    content() {
      let htmlString;
      try {
        htmlString = marked(this.md);
      } catch (error) {
        return "cannot parsed as markdown";
      }

      try {
        return this.editHtml(htmlString);
      } catch (error) {
        console.error(error);
        return htmlString;
      }
    },
    path() {
      return `/${this.$route.params.chapter}/${this.$route.params.section}/${this.$route.params.page}`;
    },
    breadcrumbsItems() {
      let ret = [{ text: this.$route.params.chapter }];
      if (this.$route.params.section) {
        ret.push({ text: this.$route.params.section });
      }
      if (this.$route.params.page) {
        this.$route.params.page.split("/").forEach((e) => {
          ret.push({ text: e });
        });
      }
      return ret;
    },
  },
  updated: function () {
    Prism.highlightAll();
    try {
      MathJax.Hub.Typeset();
    } catch (error) {
      console.log(error);
    }
  },
  watch: {
    path: {
      handler: function () {
        this.getMarkDownFromPath();
      },
      immediate: true,
    },
  },
  methods: {
    async getMarkDownFromPath() {
      if (!this.path) {
        this.md = "";
        return;
      }
      try {
        this.md = await retrieveFrom(this.path);
      } catch (error) {
        this.md = "Error: cannot get: " + this.path;
      }
    },
    editHtml(htmlString) {
      const pathToCurrentDir = this.cmsbook_url + this.$route.path.match(/.*\//);
      let ret = this.editHtmlWithJQuery(htmlString, pathToCurrentDir);
      return ret;
    },
    editHtmlWithJQuery(htmlString, pathToCurrentDir) {
      const $ = require( "jquery" );

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
          this.setAttribute("src", this.getAttribute("src").replace(/^/, pathToCurrentDir));
        });

      return tree.html();
    },
  },
};
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
