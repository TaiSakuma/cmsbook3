import { onUpdated } from "vue";

// import Prism from 'prism-es6'; // Jest doesn't work with this
import Prism from "prismjs";
import "prism-es6/components/prism-markup-templating";
import "prism-es6/components/prism-python";
import "prism-es6/components/prism-bash";
import "prism-es6/components/prism-latex";
import "@/prism.css";

export function usePrism() {
  onUpdated(() => {
    Prism.highlightAll();
  });
}