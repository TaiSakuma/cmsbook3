import { computed, ref, watchEffect, toValue } from "vue";
import { useRoute } from "vue-router";

import { useLoadFrom } from "@/utils/cmsbook3";
import { useConfig } from "@/utils/config";

export function useMarkdownSource() {
  const route = useRoute();
  const md = ref("");

  const { loadFrom } = useLoadFrom();
  const { config } = useConfig();

  const pageConcat = computed(() => {
    const _page = route.params.page;
    if (Array.isArray(_page)) return _page.join("/");
    if (_page) return _page;
    return toValue(config).indexFilename;
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
      return await loadFrom<string>(path);
    } catch (error) {
      return `# Error: cannot get: ${path} \n\n ${error}`;
    }
  }

  return { md };
}
