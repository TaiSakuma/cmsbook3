import { MaybeRef } from "vue";

import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "./edit-html";

export function useParse(
  md: MaybeRef<string>,
  pathToCurrentDir: MaybeRef<string>
) {
  const { html } = useMarkdown(md);
  const content = useEditHtml(html, pathToCurrentDir);
  return { content };
}
