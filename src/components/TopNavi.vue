<template>
  <v-tabs align-with-title background-color="transparent">
    <v-tab to="/conferences">Conferences</v-tab>
    <v-tab to="/publications">Publications</v-tab>
    <v-tab to="/meetings">Meetings</v-tab>
    <v-tab to="/seminars">Seminars</v-tab>
    <v-tab to="/CV">CV</v-tab>
    <v-tab to="/references">References</v-tab>
  </v-tabs>
</template>

<script>
import axios from "axios";

export default {
  name: "TopNavi",
  data: () => ({
    pages: []
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
