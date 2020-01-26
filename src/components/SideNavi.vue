<template>
  <v-card flat>
    <v-toolbar flat>
          <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>      
    </v-toolbar>
    <v-list>
      <v-list-item link router v-for="page in pages" :key="page.path" :to="page.path">
        <v-list-item-action>
          <v-icon >mdi-book-open</v-icon>
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
    pages: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Page", path: "/page" },
      { name: "log", path: "/help/s0000_index_001/log" }
    ],
    scratch: null
  }),
  created() {
      const pathTop = "http://localhost/~sakuma/cmsbook";
      let path = pathTop + "/" + this.$route.params.chapter;
      path = path + "/cmsbook_frame/sections.json";
      console.log(path);
      axios.get(path).then(response => {
        let sections = response.data['sections'];
        for(const s of sections) {
          s["path"] = "/" + this.$route.params.chapter + "/" + s["path"];
        }
        this.pages = sections;
      });
  }
};
</script>
