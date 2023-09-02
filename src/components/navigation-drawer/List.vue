<template>
  <v-list nav v-model:opened="opened">
    <template v-for="listContent in listContents">
      <v-list-item
        v-if="listContent.type === 'item'"
        :to="listContent.to"
        :title="listContent.title"
        :prepend-icon="listContent.prependIcon"
        :append-icon="listContent.appendIcon"
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
              >
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list-group>
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watchEffect, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";

interface ListItem {
  type: "item";
  title: string;
  to?: string;
  prependIcon?: string;
  appendIcon?: string;
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

const store = useStore();
const { chapter, sections } = storeToRefs(store);

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
            });
          });
        }
      });
    }
  });
});

const opened = ref<string[]>([]);
</script>
