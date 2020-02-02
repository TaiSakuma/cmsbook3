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
      content: ""
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
    this.loadData();
  },
  updated: function() {
    $(".markdown-body a:not([href^='#'])").attr("target", "_blank");
  },
  watch: {
    $route(to, from) {
      this.loadData();
    }
  },
  methods: {
    loadData() {
      const pathTop = "http://localhost/~sakuma/cmsbook";
      let path = pathTop + "/" + this.$route.params.chapter;
      path = path + "/" + this.$route.params.section;
      path = path + "/" + this.$route.params.page;
      path = path + ".md";
      console.log(path);
      axios.get(path).then(response => {
        this.content = marked(response.data);
      })
      .catch(error => {
        this.content = ""
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
