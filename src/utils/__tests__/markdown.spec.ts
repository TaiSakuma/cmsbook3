import { ref } from "vue";
import { describe, it, expect } from "vitest";
import { useMarkdown } from "../markdown";

describe("useMarkdown()", () => {
  it("returns html", () => {
    const { html } = useMarkdown("# Hello");
    expect(html.value).toBe("<h1>Hello</h1>\n");
  });

  it("src is reactive", () => {
    const { html, src } = useMarkdown("# Hello");
    expect(html.value).toBe("<h1>Hello</h1>\n");
    src.value = "# Hello World";
    expect(html.value).toBe("<h1>Hello World</h1>\n");
  });

  it("the arg is reactive", () => {
    const src = ref("# Hello");
    const { html } = useMarkdown(src);
    expect(html.value).toBe("<h1>Hello</h1>\n");
    src.value = "# Hello World";
    expect(html.value).toBe("<h1>Hello World</h1>\n");
  });

  it("the code is highlighted", () => {
    const { html } = useMarkdown("```python\na = 1\n```");
    const expected =
      '<pre><code class="hljs language-python">a = <span class="hljs-number">1</span>\n' +
      "</code></pre>";
    expect(html.value).toBe(expected);
  });
});
