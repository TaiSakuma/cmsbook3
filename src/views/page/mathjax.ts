import { onUpdated, toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";

export function useMathJax(element: MaybeRefOrGetter<HTMLElement | undefined>) {
  onUpdated(() => {
    // @ts-ignore
    if (!window.MathJax) return;

    if (!toValue(element)) return;
    try {
      // @ts-ignore
      window.MathJax.typesetPromise([toValue(element)]);
    } catch (error) {
      console.log(error);
    }
  });
}
