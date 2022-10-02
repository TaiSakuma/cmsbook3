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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router/composables";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

type Page =
  | { name: string; path: string; active: boolean }
  | {
      name: string;
      subcontents?: (
        | { name: string; path: string; active?: boolean }
        | {
            name: string;
            subcontents: { name: string; path: string; active?: Boolean }[];
            active?: Boolean;
          }
      )[];
      active?: Boolean;
    };

export default defineComponent({
  name: "SideNavi",
  setup() {
    const route = useRoute();
    const store = useStore();
    const { chapter, sections } = storeToRefs(store);

    // relative to chapter path, e.g., "section/web.md"
    const relativePath = computed(() =>
      route.path.split("/").slice(2).join("/")
    );

    const pages = computed(() => {
      const ret: Page[] = sections.value;

      // open v-list-group containing the current page
      ret.forEach((section) => {
        if ("subcontents" in section && section.subcontents) {
          section.subcontents.forEach((page) => {
            if ("subcontents" in page && page.subcontents) {
              page.subcontents.forEach(function (subpage) {
                if (subpage.path) {
                  if (subpage.path.split("/").length < 2) {
                    subpage.active =
                      relativePath.value ===
                      `${subpage.path}/${
                        import.meta.env.VITE_CMSBOOK_INDEX_FILENAME
                      }`;
                  } else {
                    subpage.active = relativePath.value == subpage.path;
                  }
                } else {
                  subpage.active = false;
                }
              });
              page.active = page.subcontents.map((s) => s.active).some(Boolean);
            } else if ("path" in page) {
              if (page.path.split("/").length < 2) {
                page.active =
                  relativePath.value ===
                  `${page.path}/${import.meta.env.VITE_CMSBOOK_INDEX_FILENAME}`;
              } else {
                page.active = relativePath.value == page.path;
              }
            } else {
              page.active = false;
            }
          });
          section.active = section.subcontents
            .map((s) => s.active)
            .some(Boolean);
        } else if ("path" in section && section.path) {
          if (section.path.split("/").length < 2) {
            section.active =
              relativePath.value ===
              `${section.path}/${import.meta.env.VITE_CMSBOOK_INDEX_FILENAME}`;
          } else {
            section.active = relativePath.value == section.path;
          }
        } else {
          section.active = false;
        }
      });
      return ret;
    });

    return {
      pages,
      chapter,
      sections,
    };
  },
});
</script>
