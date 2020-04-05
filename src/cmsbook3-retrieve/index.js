import axios from "axios";

export async function get_title() {
  const configUrl = process.env.VUE_APP_CMSBOOK_URL + "/.cmsbook3/title.json";
  const response = await axios.get(configUrl);
  if (response.data.title == undefined) {
    throw "title not found";
  }
  return response.data.title;
}
