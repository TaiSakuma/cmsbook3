import { useLoadFrom } from "./load";

export interface Title {
  title?: string;
}

export interface Path {
  name: string;
  path: string;
}

export interface Chapters {
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

export function useGetTitle() {
  const { loadFrom } = useLoadFrom();

  async function getTitle() {
    const path = "/.cmsbook3/title.json";
    const data = await loadFrom<Title>(path);
    if (data.title === undefined) {
      throw new Error("title undefined");
    }
    return data.title;
  }

  return { getTitle };
}

export function useGetChapters() {
  const { loadFrom } = useLoadFrom();

  async function getChapters() {
    const path = "/.cmsbook3/chapters.json";
    const data = await loadFrom<Chapters>(path);
    if (data.chapters === undefined) {
      throw new Error("chapters undefined");
    }
    return data.chapters;
  }

  return { getChapters };
}

export function useGetSectionsInChapter() {
  const { loadFrom } = useLoadFrom();

  async function getSectionsInChapter(chapterPath: string) {
    const path = `${chapterPath}/.cmsbook3/sections.json`;
    const data = await loadFrom<Sections>(path);

    if (data.sections === undefined) {
      throw new Error("sections undefined");
    }
    return data.sections;
  }

  return { getSectionsInChapter };
}
