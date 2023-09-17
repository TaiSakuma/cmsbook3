import { ref, computed, watchEffect, toValue } from "vue";
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

  const order = computed(() => (toValue(mobile) ? 0 : -1));

  return { drawer, toggleDrawer, order };
}
