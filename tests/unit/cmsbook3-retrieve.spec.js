import moxios from "moxios";

import { get_title } from "@/cmsbook3-retrieve";

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

  it("get_title url", async (done) => {
    const result = get_title();
    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(
        "http://localhost/cmsbook/.cmsbook3/title.json"
      );
      done();
    });
  });

  it("get_title success", async (done) => {
    const promiss = get_title();
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

  it("get_title error", async (done) => {
    try {
      const promiss = get_title();
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
