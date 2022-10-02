import { retrieveFrom } from "./retrieve";

export { retrieveFrom };

interface Title {
  title?: string;
}

interface Path {
  name: string;
  path: string;
}

interface Paths {
  chapters?: Path[];
}

interface Sections {
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
  if (data.title == undefined) {
    throw "title not found";
  }
  return data.title;
}

export async function getChapters() {
  const path = "/.cmsbook3/chapters.json";
  const data = await lib.retrieveFrom<Paths>(path);
  if (data.chapters == undefined) {
    throw "chapters not found";
  }
  return data.chapters;
}

export async function getSectionsInChapter(chapterPath: string) {
  const path = `${chapterPath}/.cmsbook3/sections.json`;
  const data = await lib.retrieveFrom<Sections>(path);

  if (data.sections == undefined) {
    throw "sections not found";
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
