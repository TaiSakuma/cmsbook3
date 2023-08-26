import { ref, watchEffect } from "vue";
import { useDisplay } from "vuetify";

export function useDrawer() {
  const { mobile } = useDisplay();
  const drawer = ref(true);

  watchEffect(() => {
    drawer.value = !mobile.value;
  });

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  return { drawer, toggleDrawer };
}
