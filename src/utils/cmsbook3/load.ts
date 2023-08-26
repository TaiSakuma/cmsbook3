import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import axios from "axios";

import { useConfig } from "@/utils/config";

export function useLoadFrom() {
  const { config } = useConfig();

  async function loadFrom<T>(path: MaybeRefOrGetter<string>) {
    const url = config.value.cmsbookUrl + toValue(path);
    const response = await axios.get<T>(url);
    return response.data;
  }

  return { loadFrom };
}
