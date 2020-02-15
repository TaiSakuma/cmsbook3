<template>
  <div class="page">
    <v-breadcrumbs :items="breadcrumbsItems"></v-breadcrumbs>
    <v-container fluid>
      <v-row>
        <v-col class="markdown-body ma-5 pa-5" v-html="content"></v-col>
      </v-row>
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
      let ret = [{ text: this.$route.params.chapter }];
      if (this.$route.params.section) {
        ret.push({ text: this.$route.params.section });
      }
      if (this.$route.params.page) {
        ret.push({ text: this.$route.params.page });
      }
      return ret;
    }
  },
  created: function() {
    this.updatePath();
  },
  updated: function() {
    $(".markdown-body a:not([href^='#'])").attr("target", "_blank");

    const path = process.env.VUE_APP_CMSBOOK_URL + this.$route.path.match(/.*\//)

    $(".markdown-body a:not([href^='http:'],[href^='https:'],[href^='/'],[href^='#'])").each(function() {
      this.setAttribute("href", this.getAttribute("href").replace(/^/, path));
    });

    $(".markdown-body img:not([src^='http:'],[src^='https:'],[src^='/'])").each(function() {
      this.setAttribute("src", this.getAttribute("src").replace(/^/, path));
    });

    MathJax.typeset();
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
      const sectionUrl = chapterUrl + "/" + this.$route.params.section;
      const contentUrl = sectionUrl + "/" + this.$route.params.page;
      this.path = contentUrl;
    },
    loadData() {
      if (!this.path) return;
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

.theme--dark .markdown-body {
  color: #F5F5F5;
}

.theme--light .markdown-body {
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  border-radius: 10px;
}

.theme--dark .markdown-body pre {
  background-color: #212121;
}

.theme--dark .markdown-body code {
  background-color: #212121;
  color: #F44336;
}

.theme--light .markdown-body pre {
  background-color: #EEEEEE;
}

.v-application .markdown-body code {
  box-shadow: none;
}
.v-application .markdown-body code:before {
  content: "";
}
</style>
