<template>
  <v-tabs align-with-title background-color="transparent">
    <v-tab v-for="page in pages" :key="page.namme" :to="page.path" v-text="page.name"></v-tab>
  </v-tabs>
</template>

<script>
import axios from "axios";

export default {
  name: "TopNavi",
  data: () => ({
    pages: [ ]
  }),
  methods: {
    updatePages() {
      const pathTop = "http://localhost/~sakuma/cmsbook";
      const path = pathTop + "/.cmsbook3/chapters.json";
      axios.get(path).then(response => {
        this.pages = response.data["chapters"];
      }).catch(error => {
        this.page = [];
      });
    }
  },
  created() {
    this.updatePages();
  },
  watch: {
    "$route.params.chapter": function() {
      this.updatePages();
    }
  }
};
</script>
