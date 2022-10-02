import moxios from "moxios";

import * as retrieve from "@/cmsbook3-retrieve";

const { getTitle, getChapters } = retrieve;

describe("cmsbook3-retrieve", () => {
  const ENV_ORG = process.env;

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_URL = "http://localhost/cmsbook";
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    process.env = ENV_ORG;
  });

  it("getTitle success", async () => {
    retrieve.lib.retrieveFrom = jest
      .fn()
      .mockResolvedValue({ title: "new title" });
    const result = await getTitle();
    expect(result).toBe("new title");
  });

  it("getTitle error", async () => {
    retrieve.lib.retrieveFrom = jest.fn().mockResolvedValue({});
    try {
      const result = await getTitle();
    } catch (error) {
      expect(error).toBe("title not found");
    }
  });

  it("getChapters success", async () => {
    const chapters = [
      { name: "Chapter A", path: "/chapter-A" },
      { name: "Chapter B", path: "/chapter-B" },
      { name: "Chapter C", path: "/chapter-C" },
    ];
    retrieve.lib.retrieveFrom = jest.fn().mockResolvedValue({
      chapters,
    });
    const result = await getChapters();
    expect(result).toBe(chapters);
  });

  it("getChapters error", async () => {
    retrieve.lib.retrieveFrom = jest.fn().mockResolvedValue({});
    try {
      const result = await getChapters();
    } catch (error) {
      expect(error).toBe("chapters not found");
    }
  });
});
