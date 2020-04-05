import moxios from "moxios";

import { getTitle } from "@/cmsbook3-retrieve";

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

  it("getTitle url", async (done) => {
    const result = getTitle();
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/.cmsbook3/title.json"
      );
      done();
    });
  });

  it("getTitle success", async (done) => {
    const promiss = getTitle();
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      await request.respondWith({
        status: 200,
        response: {
          title: "new title",
        },
      });
      const result = await promiss;
      expect(result).toBe("new title");
      done();
    });
  });

  it("getTitle error", async (done) => {
    try {
      const promiss = getTitle();
      moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        await request.respondWith({
          status: 200,
          response: {},
        });
      });
      const result = await promiss;
    } catch (error) {
      expect(error).toBe("title not found");
      done();
    }
  });
});
