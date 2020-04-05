import axios from "axios";

export async function retrieveFrom(path) {
  const url = process.env.VUE_APP_CMSBOOK_URL + path;
  const response = await axios.get(url);
  return response.data;
}

