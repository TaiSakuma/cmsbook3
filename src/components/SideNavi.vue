<template>
  <v-card flat>
    <v-toolbar flat>
      <v-toolbar-title v-text="$route.params.chapter"></v-toolbar-title>
    </v-toolbar>
    <v-list dense>
      <template v-for="page in pages">
        <template v-if="page.path">
          <v-list-item
            link
            router
            :key="page.name"
            :to="'/' + $route.params.chapter + '/' + page.path"
          >
            <v-list-item-action>
              <v-icon>mdi-book-open</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="page.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else-if="page.subcontents">
          <v-list-group prepend-icon="mdi-book-open" :key="page.name">
            <template v-slot:activator>
              <v-list-item-title v-html="page.name"></v-list-item-title>
            </template>
            <v-list-item
              link
              router
              v-for="subpage in page.subcontents"
              :key="subpage.name"
              :to="'/' + $route.params.chapter + '/' + subpage.path"
            >
              <v-list-item-action></v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-html="subpage.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </template>
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
      let path = process.env.VUE_APP_CMSBOOK_URL;
      path = path + "/" + this.$route.params.chapter;
      path = path + "/.cmsbook3/sections.json";
      axios
        .get(path)
        .then(response => {
          this.pages = response.data.sections;
        })
        .catch(error => {
          this.pages = [];
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
