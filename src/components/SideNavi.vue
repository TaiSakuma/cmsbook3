<template>
  <v-card flat>
    <v-toolbar flat>
      <router-link
        v-if="chapter"
        :to="chapter.path"
        style="text-decoration: none; color: inherit"
      >
        <v-toolbar-title v-text="chapter.name" v-if="chapter"></v-toolbar-title>
      </router-link>
    </v-toolbar>
    <v-list shaped nav dense expand>
      <template v-for="page in pages">
        <template v-if="page.path">
          <v-list-item
            link
            router
            :key="page.path"
            :to="'/' + $route.params.chapter + '/' + page.path"
          >
            <v-list-item-action>
              <v-icon>mdi-book</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="page.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-else-if="page.subcontents">
          <v-list-group
            prepend-icon="mdi-book-multiple"
            :key="page.name"
            :value="page.active"
          >
            <template v-slot:activator>
              <v-list-item-title v-html="page.name"></v-list-item-title>
            </template>
            <template v-for="subpage in page.subcontents">
              <template v-if="subpage.path">
                <v-list-item
                  link
                  router
                  :key="subpage.path"
                  :to="'/' + $route.params.chapter + '/' + subpage.path"
                >
                  <v-list-item-action></v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="subpage.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon>mdi-book</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </template>
              <template v-else-if="subpage.subcontents">
                <v-list-group
                  no-action
                  sub-group
                  :key="subpage.name"
                  :value="subpage.active"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="subpage.name"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item
                    link
                    router
                    v-for="subsubpage in subpage.subcontents"
                    :key="subsubpage.name"
                    :to="'/' + $route.params.chapter + '/' + subsubpage.path"
                  >
                    <v-list-item-title
                      v-html="subsubpage.name"
                    ></v-list-item-title>
                    <v-list-item-icon>
                      <v-icon>mdi-book</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>
              </template>
            </template>
          </v-list-group>
        </template>
      </template>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "SideNavi",
  data: () => ({
    pages: [],
  }),
  computed: {
    chapter() {
      return this.$store.getters.currentChapter;
    },
  },
  watch: {
    "$route.path": {
      handler: function (val) {
        const { chapter, section, page } = this.$route.params;
        this.$store.dispatch("onChangePage", { chapter, section, page });
      },
      immediate: true,
    },
    "$store.state.sectionsInCurrentChapter": {
      handler: function (val) {
        this.updatePages();
      },
      immediate: true,
    },
  },
  methods: {
    async updatePages() {
      this.pages = this.$store.state.sectionsInCurrentChapter || [];

      const relativePath = this.$route.path.split("/").slice(2).join("/");
      // relative to chapger path, e.g., "section/web.md"

      // open v-list-group containing the current page
      this.pages.forEach(function (section) {
        if (section.subcontents) {
          section.subcontents.forEach(function (page) {
            if (page.subcontents) {
              page.subcontents.forEach(function (subpage) {
                if (subpage.path) {
                  if (subpage.path.split("/").length < 2) {
                    subpage.active =
                      relativePath ==
                      subpage.path +
                        "/" +
                        process.env.VUE_APP_CMSBOOK_INDEX_FILENAME;
                  } else {
                    subpage.active = relativePath == subpage.path;
                  }
                } else {
                  subpage.active = false;
                }
              });
              page.active = page.subcontents.map((s) => s.active).some(Boolean);
            } else if (page.path) {
              if (page.path.split("/").length < 2) {
                page.active =
                  relativePath ==
                  page.path + "/" + process.env.VUE_APP_CMSBOOK_INDEX_FILENAME;
              } else {
                page.active = relativePath == page.path;
              }
            } else {
              page.active = false;
            }
          });
          section.active = section.subcontents
            .map((s) => s.active)
            .some(Boolean);
        } else if (section.path) {
          if (section.path.split("/").length < 2) {
            section.active =
              relativePath ==
              section.path + "/" + process.env.VUE_APP_CMSBOOK_INDEX_FILENAME;
          } else {
            section.active = relativePath == section.path;
          }
        } else {
          section.active = false;
        }
      });
    },
  },
};
</script>
