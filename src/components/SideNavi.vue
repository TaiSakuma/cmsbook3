<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>
    </v-toolbar>
    <v-list>
      <v-list-item link router v-for="page in pages" :key="page.path" :to="page.path">
        <v-list-item-action>
          <v-icon>mdi-book-open</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="page.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "SideNavi",
  data: () => ({
    pages: []
  }),
  methods: {
    updatePages() {
      const pathTop = "http://localhost/~sakuma/cmsbook";
      let path = pathTop + "/" + this.$route.params.chapter;
      path = path + "/.cmsbook3/sections.json";
      axios.get(path).then(response => {
        let sections = response.data["sections"];
        for (const s of sections) {
          s["path"] = "/" + this.$route.params.chapter + "/" + s["path"];
        }
        this.pages = sections;
      })
      .catch(error => {
        this.pages = [ ]
      });
    }
  },
  created() {
      this.updatePages();
  },
  watch: {
    '$route.params.chapter': function() {
        this.updatePages();
    }
  }
};
</script>
