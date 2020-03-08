import moxios from "moxios";
import router from "@/router/index.js";

describe("About.vue", () => {
  const ENV_ORG = process.env;

  beforeEach(() => {
    process.env.VUE_APP_CMSBOOK_INDEX_FILENAME = "test_index.md";
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    process.env = ENV_ORG;
  });

  it("test home", () => {
    router.push("/");
    const current = router.history.current;
    expect(current.name).toBe("home");
    expect(current.path).toBe("/");
    expect(current.params).toEqual({})
  });

  it("test about", () => {
    router.push("/about");
    const pending = router.history.pending;
    expect(pending.name).toBe("about");
    expect(pending.path).toBe("/about");
    expect(pending.params).toEqual({})
  });

  it("test page", () => {
    router.push("/chapter-A/section-B/page-c.md");
    expect(router.history.pending).toBeNull();
    const current = router.history.current;
    expect(current.name).toBe("page");
    expect(current.path).toBe("/chapter-A/section-B/page-c.md");
    expect(current.params).toEqual({
      chapter: "chapter-A",
      section: "section-B",
      page: "page-c.md"
    });
  });

  it("test section", () => {
    router.push("/chapter-A/section-B");
    expect(router.history.current.path).toBe(
      "/chapter-A/section-B/test_index.md"
    );
  });

  it("test chapter", () => {
    router.push("/chapter-A");
    const current = router.history.current;
    expect(current.name).toBe("chapter");
    expect(current.path).toBe("/chapter-A");
    expect(current.params).toEqual({
      chapter: "chapter-A",
    })
  });

});
