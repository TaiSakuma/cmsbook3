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

  it("retrieveFrom url", async (done) => {
    const path = "/path/to/data.json";
    const result = retrieve.retrieveFrom(path);
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/path/to/data.json"
      );
      done();
    });
  });

  it("retrieveFrom success", async (done) => {
    const path = "/path/to/data.json";
    const promiss = retrieve.retrieveFrom(path);
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: {
          fieldA: "data A",
        },
      });
      const result = await promiss;
      expect(result).toEqual({ fieldA: "data A" });
      done();
    });
  });

  it("getTitle success", async () => {
    retrieve.lib.retrieveFrom = jest
      .fn()
      .mockResolvedValue({ title: "new title" });
    const result = await getTitle();
    expect(result).toBe("new title");
  });

  it("getTitle error", async () => {
    retrieve.lib.retrieveFrom = jest
      .fn()
      .mockResolvedValue({ });
    try {
      const result = await getTitle();
    } catch (error) {
      expect(error).toBe("title not found");
    }
  });

});
