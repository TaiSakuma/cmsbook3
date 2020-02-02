<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <v-container>
      <article class="markdown-body">
        <div v-html="content"></div>
      </article>
    </v-container>
  </div>
</template>

<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
<script>
import axios from "axios";
import marked from "marked";

export default {
  name: "page",
  data() {
    return {
      content: "",
      path: ""
    };
  },
  computed: {
    breadcrumbsItems() {
      return [
        { text: this.$route.params.chapter },
        { text: this.$route.params.section },
        { text: this.$route.params.page }
      ];
    }
  },
  created: function() {
    this.updatePath();
  },
  updated: function() {
    $(".markdown-body a:not([href^='#'])").attr("target", "_blank");
    MathJax.typeset()
  },
  watch: {
    path() {
      this.loadData();
    },
    $route(to, from) {
      this.content = "";
      this.updatePath();
    }
  },
  methods: {
    updatePath() {
      const cmsbookUrl = process.env.VUE_APP_CMSBOOK_URL;
      const chapterUrl = cmsbookUrl + "/" + this.$route.params.chapter;

      if(!this.$route.params.section) {
        const configUrl = chapterUrl + "/.cmsbook3/sections.json";
        axios.get(configUrl)
        .then(response => {
          if(!response.data.home) {
            this.path = "";
            return;
          }
          this.path = chapterUrl + "/" + response.data.home + ".md";
          return;
        })
        .catch(error => {
          this.path = "";
          return;
        });

      }

      const sectionUrl = chapterUrl + "/" + this.$route.params.section;
      const contentUrl = sectionUrl + "/" + this.$route.params.page + ".md";
      this.path = contentUrl;
    },
    loadData() {
      if(!this.path) return;
      axios.get(this.path).then(response => {
        this.content = marked(response.data);
      });
    }
  }
};
</script>

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style>
@import "../../node_modules/github-markdown-css/github-markdown.css";
.markdown-body {
  background-color: #ffffff;
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  padding: 10px;
}
.v-application .markdown-body code {
  background-color: #f0f0f0;
  box-shadow: none;
}
.v-application .markdown-body code:before {
  content: "";
}
</style>
