import axios from "axios";

export async function retrieveFrom<T>(path: string) {
  const url = import.meta.env.VITE_CMSBOOK_URL + path;
  const response = await axios.get<T>(url);
  return response.data;
}
