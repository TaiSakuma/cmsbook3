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
    pages: [
      { name: "Conferences", path: "/conferences" },
      { name: "Publications", path: "/publications" },
      { name: "Meetings", path: "/meetings" },
      { name: "CV", path: "/CV" },
      { name: "References", path: "/references" }
    ]
  }),
  methods: {
    updatePages() {}
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
