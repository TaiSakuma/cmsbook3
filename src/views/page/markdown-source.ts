import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { retrieveFrom } from "@/cmsbook3-retrieve";

export function useMarkdownSource() {

  const route = useRoute();
  const md = ref("");

  const pageConcat = computed(() => {
    if (typeof route.params.page === "string") {
      return route.params.page;
    } else {
      return route.params.page.join("/");
    }
  });

  const path = computed(
    () => `/${route.params.chapter}/${route.params.section}/${pageConcat.value}`
  );

  watch(
    path,
    async () => {
      await getMarkDownFromPath();
    },
    { immediate: true }
  );

  async function getMarkDownFromPath() {
    if (!path.value) {
      md.value = "";
      return;
    }
    try {
      md.value = await retrieveFrom(path.value);
    } catch (error) {
      md.value = "Error: cannot get: " + path.value;
    }
  }

  return { md };
}
