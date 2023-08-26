import { onUpdated } from "vue";

export function useMathJax() {
  onUpdated(() => {
    try {
      // @ts-ignore
      window.MathJax.typesetPromise();
    } catch (error) {
      console.log(error);
    }
  });
}
