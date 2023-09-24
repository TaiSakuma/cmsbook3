import { computed, ref, unref, MaybeRef } from "vue";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const marked = new Marked({
  gfm: true,
  ...markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
});

export function useMarkdown(src: MaybeRef<string>) {
  const refSrc = ref(src);
  const html = computed(() => marked.parse(unref(refSrc)) as string);
  return { html, src: refSrc };
}
