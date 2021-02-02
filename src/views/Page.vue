<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <v-container fluid class="px-0 pt-0">
      <v-row class="mx-0 px-5">
        <v-col class="ma-0 pa-0">
          <v-card outlined class="markdown-body pa-5" v-html="content"></v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
<script>
import marked from "marked";

import { retrieveFrom } from "@/cmsbook3-retrieve";

export default {
  name: "page",
  data() {
    return {
      cmsbook_url: process.env.VUE_APP_CMSBOOK_URL,
      md: ""
    };
  },
  computed: {
    content() {
      try {
        return marked(this.md);
      } catch(error) {
        return "cannot parsed as markdown"
      }
    },
    path() {
      return (
        "/" +
        this.$route.params.chapter +
        "/" +
        this.$route.params.section +
        "/" +
        this.$route.params.page
      );
    },
    breadcrumbsItems() {
      let ret = [{ text: this.$route.params.chapter }];
      if (this.$route.params.section) {
        ret.push({ text: this.$route.params.section });
      }
      if (this.$route.params.page) {
        this.$route.params.page.split("/").forEach(e => {
          ret.push({ text: e });
        });
      }
      return ret;
    }
  },
  updated: function() {
    $(".markdown-body a:not([href^='#'])").attr("target", "_blank");

    const path = this.cmsbook_url + this.$route.path.match(/.*\//);

    $(
      ".markdown-body a:not([href^='http:'],[href^='https:'],[href^='file:'],[href^='/'],[href^='#'])"
    ).each(function() {
      this.setAttribute("href", this.getAttribute("href").replace(/^/, path));
    });

    $(".markdown-body img:not([src^='http:'],[src^='https:'],[src^='/'])").each(
      function() {
        this.setAttribute("src", this.getAttribute("src").replace(/^/, path));
      }
    );

    MathJax.Hub.Typeset()
  },
  watch: {
    path: {
      handler: function() {
        this.getMarkDownFromPath();
      },
      immediate: true
    }
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
    }
  }
};
</script>

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style>
@import "../../node_modules/github-markdown-css/github-markdown.css";

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  border-radius: 10px;
}

.v-application .markdown-body code {
  box-shadow: none;
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
  background-color: #212121;
  color: #f44336;
}

.theme--light .markdown-body pre {
  background-color: #eeeeee;
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
