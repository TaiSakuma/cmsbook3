export interface Config {
  cmsbookUrl: string;
  indexFilename: string;
}

export const defaultConfig = {
  indexFilename: "index.md",
};

export function validateConfig(config: Config) {
  if (typeof config.cmsbookUrl !== "string")
    throw Error("cmsbookUrl is not string");
  if (config?.cmsbookUrl === "") throw Error("cmsbookUrl is empty");

  if (typeof config.indexFilename !== "string")
    throw Error("indexFilename is not string");
  if (config?.indexFilename === "") throw Error("indexFilename is empty");
}
