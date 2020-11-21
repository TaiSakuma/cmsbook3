<template>
  <v-tabs optional align-with-title background-color="transparent">
    <v-tab
      v-for="chapter in chapters"
      :key="chapter.name"
      :to="chapter.path"
      v-text="chapter.name"
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
    chapters: [],
  }),
  methods: {
    async updatePages() {
      const path = "/.cmsbook3/chapters.json";
      try {
        const data = await retrieveFrom(path);
        this.chapters = data["chapters"];
      } catch (error) {
        this.chapters = [];
      }
    },
  },
  created() {
    this.updatePages();
  },
};
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
