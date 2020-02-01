<template>
  <v-tabs align-with-title background-color="transparent">
    <v-tab>Tab 1</v-tab>
    <v-tab>Tab 2</v-tab>
    <v-tab>Tab 3</v-tab>
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
