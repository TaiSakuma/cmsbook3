<template>
  <v-navigation-drawer comment="fallthrough attributes">
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
    <v-list nav v-model:opened="opened">
      <template v-for="listContent in listContents">
        <v-list-item
          v-if="listContent.type === 'item'"
          :to="listContent.to"
          :title="listContent.title"
          :prepend-icon="listContent.prependIcon"
          :append-icon="listContent.appendIcon"
          :active="listContent.active"
        >
        </v-list-item>
        <v-list-group
          v-else-if="listContent.type === 'group'"
          :value="listContent.value"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="listContent.title"
              :prepend-icon="listContent.prependIcon"
              :append-icon="listContent.appendIcon"
            >
            </v-list-item>
          </template>
          <template v-for="groupContent in listContent.contents">
            <v-list-item
              v-if="groupContent.type === 'item'"
              :to="groupContent.to"
              :title="groupContent.title"
              :prepend-icon="groupContent.prependIcon"
              :append-icon="groupContent.appendIcon"
              :active="groupContent.active"
            >
            </v-list-item>
            <v-list-group
              v-else-if="groupContent.type === 'group'"
              :value="groupContent.value"
            >
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  :title="groupContent.title"
                  :prepend-icon="groupContent.prependIcon"
                  :append-icon="groupContent.appendIcon"
                >
                </v-list-item>
              </template>
              <template v-for="subgroupContent in groupContent.contents">
                <v-list-item
                  v-if="subgroupContent.type === 'item'"
                  :to="subgroupContent.to"
                  :title="subgroupContent.title"
                  :prepend-icon="subgroupContent.prependIcon"
                  :append-icon="subgroupContent.appendIcon"
                  :active="subgroupContent.active"
                >
                </v-list-item>
              </template>
            </v-list-group>
          </template>
        </v-list-group>
      </template>
    </v-list>
    <template v-slot:append>
      <div class="ma-4 d-flex justify-space-around align-center">
        <toggle-dark-mode-button></toggle-dark-mode-button>
        <span class="text-secondary text-body-2">v{{ packageVersion }}</span>
      </div>
      <v-list>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, watchEffect, reactive } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";

import ToggleDarkModeButton from "@/components/ToggleDarkModeButton.vue";

interface ListItem {
  type: "item";
  title: string;
  to?: string;
  prependIcon?: string;
  appendIcon?: string;
  active: boolean;
}

interface ListGroup {
  type: "group";
  value: string;
  title: string;
  prependIcon?: string;
  appendIcon?: string;
  contents: (ListItem | ListGroup)[];
}

type ListContent = ListItem | ListGroup;
type ListContents = ListContent[];

const route = useRoute();
const store = useStore();
const { packageVersion, chapter, sections } = storeToRefs(store);

// relative to chapter path, e.g., "section/web.md"
const relativePath = computed(() => route.path.split("/").slice(2).join("/"));

const listContents = reactive<ListContents>([]);
const opened = reactive<string[]>([]);
let groupCounter = 0; // for unique value

watchEffect(() => {
  listContents.splice(0, listContents.length);
  groupCounter = 0;
  sections.value.forEach((section) => {
    if (!("subcontents" in section)) {
      const to =
        "path" in section ? `${chapter.value.path}/${section.path}` : undefined;
      const active = "path" in section && isActive(section.path);
      listContents.push({
        type: "item",
        title: section.name,
        prependIcon: "mdi-book",
        ...(to && { to }),
        active,
      });
    } else {
      const groupContents: ListContents = [];
      const groupValue = `${groupCounter++}-${section.name}`;
      listContents.push({
        type: "group",
        value: groupValue,
        title: section.name,
        prependIcon: "mdi-book-multiple",
        contents: groupContents,
      });
      const subsections = section.subcontents;
      subsections?.forEach((subsection) => {
        if (!("subcontents" in subsection)) {
          const to =
            "path" in subsection
              ? `${chapter.value.path}/${subsection.path}`
              : undefined;
          const active = "path" in subsection && isActive(subsection.path);
          groupContents.push({
            type: "item",
            title: subsection.name,
            appendIcon: "mdi-book",
            ...(to && { to }),
            active,
          });
          active && (opened.includes(groupValue) || opened.push(groupValue));
        } else {
          const subGroupContents: ListContents = [];
          const subGroupValue = `${groupCounter++}-${subsection.name}`;
          groupContents.push({
            type: "group",
            value: subGroupValue,
            title: subsection.name,
            contents: subGroupContents,
          });
          const subsubsections = subsection.subcontents;
          subsubsections.forEach((subsubsection) => {
            const to =
              "path" in subsubsection
                ? `${chapter.value.path}/${subsubsection.path}`
                : undefined;
            const active =
              "path" in subsubsection && isActive(subsubsection.path);
            subGroupContents.push({
              type: "item",
              title: subsubsection.name,
              appendIcon: "mdi-book",
              ...(to && { to }),
              active,
            });
            if (active) {
              opened.includes(groupValue) || opened.push(groupValue);
              opened.includes(subGroupValue) || opened.push(subGroupValue);
            }
          });
        }
      });
    }
  });
});

function isActive(path: string) {
  return path.split("/").length < 2
    ? relativePath.value ===
        `${path}/${import.meta.env.VITE_CMSBOOK_INDEX_FILENAME}`
    : relativePath.value == path;
}
</script>
