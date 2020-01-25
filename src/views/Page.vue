<template>
  <div class="page">
    <v-container>
      <p>Page</p>
      <p>{{ $route.params.chapter }}</p>
      <p>{{ $route.params.section }}</p>
      <p>{{ $route.params.page }}</p>
      <div>
        <article class="markdown-body">
          <VueShowdown :markdown="markdown" flavor="github"></VueShowdown>
        </article>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import { VueShowdown } from "vue-showdown";

export default {
  name: "page",
  components: {
    VueShowdown
  },
  data() {
    return {
      markdown: ""
    };
  },
  created: function() {
    this.loadData();
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
        this.markdown = response.data;
      });
    }
  }
};
</script>

<!-- https://github.com/sindresorhus/github-markdown-css -->
<style>
@import "../../node_modules/github-markdown-css/github-markdown.css";
.markdown-body {
  background-color: white;
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  padding: 10px;
}
.v-application .markdown-body code {
  background-color: #f5f5f5;
  box-shadow: none;
}
.v-application .markdown-body code:before {
  content: "";
}
</style>
