<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const items = computed(() => {
  let ret = [{ title: route.params.chapter }];
  if (route.params.section) {
    ret.push({ title: route.params.section });
  }
  if (Array.isArray(route.params.page)) {
    route.params.page.forEach((e) => {
      ret.push({ title: e });
    });
  } else if (route.params.page) {
    ret.push({ title: route.params.page });
  }
  return ret;
});
</script>
