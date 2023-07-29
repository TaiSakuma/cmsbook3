<template>
  <v-navigation-drawer v-model="drawer" permanent>
    <template v-slot:prepend>
      <div class="pa-4">
        <router-link
          v-if="chapter"
          :to="chapter.path"
          style="text-decoration: none; color: inherit"
        >
          {{ chapter.name }}
        </router-link>
      </div>
    </template>
    <v-list nav>
      <template v-for="page in pages">
        <template v-if="page.path">
          <v-list-item
            link
            router
            :key="page.path"
            :to="`/${$route.params.chapter}/${page.path}`"
            prepend-icon="mdi-book"
            :title="page.name"
          >
          </v-list-item>
        </template>
        <template v-else-if="page.subcontents">
          <v-list-group
            prepend-icon="mdi-book-multiple"
            :key="page.name"
            :value="page.active"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                prepend-icon="mdi-book-multiple"
                :title="page.name"
              ></v-list-item>
            </template>
            <template v-for="subpage in page.subcontents">
              <template v-if="subpage.path">
                <v-list-item
                  link
                  router
                  :key="subpage.path"
                  :to="`/${$route.params.chapter}/${subpage.path}`"
                  :title="subpage.name"
                  append-icon="mdi-book"
                >
                </v-list-item>
              </template>
              <template v-else-if="subpage.subcontents">
                <v-list-group
                  no-action
                  sub-group
                  :key="subpage.name"
                  :value="subpage.active"
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      :title="subpage.name"
                      append-icon="mdi-book-multiple"
                    ></v-list-item>
                  </template>
                  <v-list-item
                    link
                    router
                    v-for="subsubpage in subpage.subcontents"
                    :key="subsubpage.name"
                    :to="`/${$route.params.chapter}/${subsubpage.path}`"
                    :title="subsubpage.name"
                    append-icon="mdi-book"
                  >
                  </v-list-item>
                </v-list-group>
              </template>
            </template>
          </v-list-group>
        </template>
      </template>
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item :title="`v${packageVersion}`" disabled> </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

interface Props {
  modelValue: boolean;
}
interface Emits {
  (event: "update:modelValue", value: boolean): void;
}
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const drawer = ref(true);
watch(props, (val) => {
  drawer.value = val.modelValue;
});
watch(drawer, (val) => {
  emit("update:modelValue", val);
});

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

const route = useRoute();
const store = useStore();
const { packageVersion, chapter, sections } = storeToRefs(store);

// relative to chapter path, e.g., "section/web.md"
const relativePath = computed(() => route.path.split("/").slice(2).join("/"));

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
      section.active = section.subcontents.map((s) => s.active).some(Boolean);
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
</script>
