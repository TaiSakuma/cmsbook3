import axios from "axios";

export async function retrieveFrom(path) {
  const url = import.meta.env.VITE_CMSBOOK_URL + path;
  const response = await axios.get(url);
  return response.data;
}
