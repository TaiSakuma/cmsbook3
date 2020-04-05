import moxios from "moxios";

import * as retrieve from "@/cmsbook3-retrieve";

const { getTitle } = retrieve;

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
});