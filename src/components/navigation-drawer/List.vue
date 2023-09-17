<template>
  <v-list
    v-if="listContents.length"
    nav
    v-model:opened="opened"
    open-strategy="multiple"
  >
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
import { ref } from "vue";
import { useListContents } from "./list-contents";
const { listContents } = useListContents();
const opened = ref<string[]>();
</script>
