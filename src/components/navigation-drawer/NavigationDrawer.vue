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
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, watchEffect, reactive } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
import { useConfig } from "@/utils/config";

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
const { config } = useConfig();

const listContents = reactive<ListContents>([]);

watchEffect(() => {
  const chapterPath = chapter.value?.path;
  if (!chapterPath) return;
  listContents.splice(0, listContents.length);
  let groupCounter = 0; // for unique value
  sections.value.forEach((section) => {
    if (!("subcontents" in section)) {
      const to =
        "path" in section ? `${chapterPath}/${section.path}` : undefined;
      listContents.push({
        type: "item",
        title: section.name,
        prependIcon: "mdi-book",
        ...(to && { to }),
        active: false,
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
              ? `${chapterPath}/${subsection.path}`
              : undefined;
          groupContents.push({
            type: "item",
            title: subsection.name,
            appendIcon: "mdi-book",
            ...(to && { to }),
            active: false,
          });
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
                ? `${chapterPath}/${subsubsection.path}`
                : undefined;
            subGroupContents.push({
              type: "item",
              title: subsubsection.name,
              appendIcon: "mdi-book",
              ...(to && { to }),
              active: false,
            });
          });
        }
      });
    }
  });
});

// relative to chapter path, e.g., "section/web.md"
const relativePath = computed(() => route.path.split("/").slice(2).join("/"));

const opened = reactive<string[]>([]);

function isActive(path: string) {
  const _path = path.split("/").slice(2).join("/");
  return _path.split("/").length < 2
    ? relativePath.value === `${_path}/${config.value.indexFilename}`
    : relativePath.value == _path;
}

watchEffect(() => {
  listContents.forEach((listContent) => {
    if (listContent.type === "item") {
      listContent.active = isActive(listContent.to!);
    } else {
      listContent.contents.forEach((groupContent) => {
        if (groupContent.type === "item") {
          groupContent.active = isActive(groupContent.to!);
          if (groupContent.active) {
            opened.includes(listContent.value) ||
              opened.push(listContent.value);
          }
        } else {
          groupContent.contents.forEach((subgroupContent) => {
            if (subgroupContent.type === "item") {
              subgroupContent.active = isActive(subgroupContent.to!);
              if (subgroupContent.active) {
                opened.includes(listContent.value) ||
                  opened.push(listContent.value);
                opened.includes(groupContent.value) ||
                  opened.push(groupContent.value);
              }
            }
          });
        }
      });
    }
  });
});
</script>
