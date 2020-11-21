<template>
  <v-tabs optional align-with-title background-color="transparent">
    <v-tab
      v-for="page in pages"
      :key="page.name"
      :to="page.path"
      v-text="page.name"
      class="no-uppercase"
    ></v-tab>
    <v-tab to="/" v-show="false">
      <!-- to hide v-tabs-slider when none is selected -->
    </v-tab>
  </v-tabs>
</template>

<script>
import { retrieveFrom } from "@/cmsbook3-retrieve";

export default {
  name: "TopNavi",
  data: () => ({
    pages: []
  }),
  methods: {
    async updatePages() {
      const path = "/.cmsbook3/chapters.json";
      try {
        const data = await retrieveFrom(path);
        this.pages = data["chapters"];
      } catch (error) {
        this.pages = [];
      }
    }
  },
  created() {
    this.updatePages();
  }
};
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
