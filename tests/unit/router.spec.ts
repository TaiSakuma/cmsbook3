import moxios from "moxios";
import router from "@/router/index.js";

describe("About.vue", () => {
  const ENV_ORG = process.env;
  // @ts-ignore
  const ROUTER_HISTORY_CURRNT_ORG = router.history.current;

  beforeEach(() => {
    import.meta.env.VITE_CMSBOOK_INDEX_FILENAME = "test_index.md";
    moxios.install();

    // Ideatly, VueRouter should be instantiated for each test.
    // But instead here, only the current and pending are set.
    // @ts-ignore
    router.history.current = { ...ROUTER_HISTORY_CURRNT_ORG };
    // @ts-ignore
    router.history.pending = null;
  });

  afterEach(() => {
    moxios.uninstall();
    process.env = ENV_ORG;
    // @ts-ignore
    router.history.current = ROUTER_HISTORY_CURRNT_ORG;
    // @ts-ignore
    router.history.pending = null;
  });

  it("test home", () => {
    router.push("/");
    // Not clear how to test for the same reason for the
    // test chapter below
  });

  it("test about", () => {
    router.push("/about");
    // @ts-ignore
    const pending = router.history.pending;
    expect(pending.name).toBe("about");
    expect(pending.path).toBe("/about");
    expect(pending.params).toEqual({});
  });

  it("test page", () => {
    router.push("/chapter-A/section-B/page-c.md");
    // @ts-ignore
    expect(router.history.pending).toBeNull();
    // @ts-ignore
    const current = router.history.current;
    expect(current.name).toBe("page");
    expect(current.path).toBe("/chapter-A/section-B/page-c.md");
    expect(current.params).toEqual({
      chapter: "chapter-A",
      section: "section-B",
      page: "page-c.md",
    });
  });

  it("test page in a folder", () => {
    router.push("/chapter-A/section-B/folder-C/page-c.md");
    // @ts-ignore
    expect(router.history.pending).toBeNull();
    // @ts-ignore
    const current = router.history.current;
    expect(current.name).toBe("page");
    expect(current.path).toBe("/chapter-A/section-B/folder-C/page-c.md");
    expect(current.params).toEqual({
      chapter: "chapter-A",
      section: "section-B",
      page: "folder-C/page-c.md",
    });
  });

  it("test section", () => {
    router.push("/chapter-A/section-B");
    // @ts-ignore
    expect(router.history.current.path).toBe(
      "/chapter-A/section-B/test_index.md"
    );
  });

  it("test chapter", async () => {
    router.push("/chapter-A");
    // Not sure how to test. "beforeEnter" for this path is an
    // async funciton. The above push returns "Promise { <pending> }".
    // The document for the Vue Router says
    // "the navigation is considered pending before all hooks have
    // been resolved."
    // (https://router.vuejs.org/guide/advanced/navigation-guards.html)
    // Not clear how to manually trigger resolving the hooks.
  });
});
