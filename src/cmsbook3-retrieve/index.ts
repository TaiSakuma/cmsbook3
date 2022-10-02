import { retrieveFrom } from "./retrieve";

export { retrieveFrom };

export interface Title {
  title?: string;
}

export interface Path {
  name: string;
  path: string;
}

export interface Paths {
  chapters?: Path[];
}

export interface Sections {
  sections?: (
    | Path
    | {
        name: string;
        subcontents?: (Path | { name: string; subcontents: Path[] })[];
      }
  )[];
}

export async function getTitle() {
  const path = "/.cmsbook3/title.json";
  const data = await lib.retrieveFrom<Title>(path);
  if (data.title === undefined) {
    throw new Error("title undefined");
  }
  return data.title;
}

export async function getChapters() {
  const path = "/.cmsbook3/chapters.json";
  const data = await lib.retrieveFrom<Paths>(path);
  if (data.chapters === undefined) {
    throw new Error("chapters undefined");
  }
  return data.chapters;
}

export async function getSectionsInChapter(chapterPath: string) {
  const path = `${chapterPath}/.cmsbook3/sections.json`;
  const data = await lib.retrieveFrom<Sections>(path);

  if (data.sections === undefined) {
    throw new Error("sections undefined");
  }
  return data.sections;
}

// export functions for ease of mocking
// https://medium.com/@qjli/how-to-mock-specific-module-function-in-jest-715e39a391f4
// https://luetkemj.github.io/170421/mocking-modules-in-jest
export const lib = {
  retrieveFrom,
  getTitle,
  getChapters,
  getSectionsInChapter,
};

export default lib;
