import { computed } from "vue";
import { useTitle } from "@vueuse/core";

import { useStore } from "@/stores/main";

function useSetTitle() {
  const store = useStore();
  const title = computed(() => store.title || "loading...");

  // https://vueuse.org/core/useTitle/
  return useTitle(title);
}

export { useSetTitle };
