import { computed, ref, watchEffect, toValue } from "vue";
import { useRoute } from "vue-router";

import { retrieveFrom } from "@/cmsbook3-retrieve";

export function useMarkdownSource() {
  const route = useRoute();
  const md = ref("");

  const pageConcat = computed(() => {
	const _page = route.params.page;
	return Array.isArray(_page) ? _page.join("/") : _page;
  });

  const path = computed(
    () => `/${route.params.chapter}/${route.params.section}/${pageConcat.value}`
  );

  watchEffect(async () => {
    md.value = await fetch(toValue(path));
  });

  async function fetch(path: string) {
    if (!path) return "";
    try {
      return await retrieveFrom<string>(path);
    } catch (error) {
      return `# Error: cannot get: ${path} \n\n ${error}`;
    }
  }

  return { md };
}
