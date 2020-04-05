import axios from "axios";

export async function get_title() {
  const configUrl = process.env.VUE_APP_CMSBOOK_URL + "/.cmsbook3/title.json";
  const response = await axios.get(configUrl);
  if (response.data.title == undefined) {
    throw "title not found";
  }
  return response.data.title;
}

// export functions for ease of mocking
// https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
const exportFunctions = {
  get_title,
};

export default exportFunctions;
