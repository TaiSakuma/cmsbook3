import { computed, ref, toValue } from "vue";
import { useRoute } from "vue-router";

import { useMarkdownSource } from "./markdown-source";
import { useParse } from "./parse";

export function useContent() {
  const cmsbook_url = ref(import.meta.env.VITE_CMSBOOK_URL);
  const route = useRoute();
  const pathToCurrentDir = computed(
    () => toValue(cmsbook_url) + route.path.match(/.*\//)
  );
  const { md } = useMarkdownSource();

  const { content } = useParse(md, pathToCurrentDir);

  return { content };
}
