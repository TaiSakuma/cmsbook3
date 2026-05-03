import { onUpdated, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

export function useMathJax(element: MaybeRefOrGetter<HTMLElement | undefined>) {
  onUpdated(() => {
    // @ts-expect-error MathJax is loaded via public/load-mathjax.js, not typed
    if (!window.MathJax) return;

    if (!toValue(element)) return;
    try {
      // @ts-expect-error MathJax is loaded via public/load-mathjax.js, not typed
      window.MathJax.typesetPromise([toValue(element)]);
    } catch (error) {
      console.log(error);
    }
  });
}
