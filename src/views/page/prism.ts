import { onUpdated, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

// import Prism from 'prism-es6'; // Jest doesn't work with this
import Prism from "prismjs";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-latex";
import "@/prism.css";

export function usePrism(element: MaybeRefOrGetter<HTMLElement | undefined>) {
  onUpdated(() => {
    const ele = toValue(element);
    if (!ele) return;
    Prism.highlightAllUnder(ele);
  });
}
