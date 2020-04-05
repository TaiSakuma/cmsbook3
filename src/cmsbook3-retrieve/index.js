import axios from "axios";

export async function retrieveFrom(path) {
  const url = process.env.VUE_APP_CMSBOOK_URL + path;
  const response = await axios.get(url);
  return response.data;
}

export async function getTitle() {
  const path = "/.cmsbook3/title.json";
  const data = await lib.retrieveFrom(path);
  if (data.title == undefined) {
    throw "title not found";
  }
  return data.title;
}

// export functions for ease of mocking
// https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
// https://luetkemj.github.io/170421/mocking-modules-in-jest
export const lib = {
  retrieveFrom,
  getTitle,
};

export default lib;
