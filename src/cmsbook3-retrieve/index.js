import axios from "axios";

export async function retrieveDataFromPath(path) {
  const url = process.env.VUE_APP_CMSBOOK_URL + path;
  const response = await axios.get(url);
  return response.data;
}

export async function getTitle() {
  const path = "/.cmsbook3/title.json";
  const data = await retrieveDataFromPath(path);
  if (data.title == undefined) {
    throw "title not found";
  }
  return data.title;
}

// export functions for ease of mocking
// https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
const exportFunctions = {
  retrieveDataFromPath,
  getTitle,
};

export default exportFunctions;
