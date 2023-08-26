import { computed, ref, toValue } from "vue";
import { useRoute } from "vue-router";

import { useConfig } from "@/utils/config";

import { useMarkdownSource } from "./markdown-source";
import { useParse } from "./parse";

export function useContent() {
const { config } = useConfig();
  const cmsbookUrl = ref(config.value.cmsbookUrl);
  const route = useRoute();
  const pathToCurrentDir = computed(
    () => toValue(cmsbookUrl) + route.path.match(/.*\//)
  );
  const { md } = useMarkdownSource();

  const { content } = useParse(md, pathToCurrentDir);

  return { content };
}
