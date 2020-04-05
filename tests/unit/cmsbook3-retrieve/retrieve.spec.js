import moxios from "moxios";

import { retrieveFrom } from "@/cmsbook3-retrieve";

describe("retrieveFrom", () => {
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
    const result = retrieveFrom(path);
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
    const promiss = retrieveFrom(path);
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

  it("retrieveFrom 404 not catched", async (done) => {
    const path = "/path/to/data.json";
    try {
      const promiss = retrieveFrom(path);
      moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        await request.respondWith({
          status: 404,
        });
      });
      const result = await promiss;
    } catch (error) {
      done();
    }
  });
});
