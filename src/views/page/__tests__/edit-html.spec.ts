import { ref } from "vue";
import { describe, it, expect } from "vitest";
import { useMarkdown } from "@/utils/markdown";
import { useEditHtml } from "../edit-html";

describe("useEditHtml()", () => {
  it("no edit", () => {
    const { html } = useMarkdown("# Hello");
    const edited = useEditHtml(html, ref(""));
    expect(edited.value).toBe("<h1>Hello</h1>\n");
  });

  it("external links", () => {
    const src = ref(
      "[link1](https://example.com), [link2](https://example.com)"
    );
    const { html } = useMarkdown(src);
    const edited = useEditHtml(html, ref(""));
    const expected =
      "<p>" +
      '<a href="https://example.com" target="_blank">link1' +
      " " +
      '<i class="mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i></a>, ' +
      '<a href="https://example.com" target="_blank">link2' +
      " " +
      '<i class="mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i></a>' +
      "</p>\n";

    expect(edited.value).toBe(expected);
  });

  it("link on image", () => {
    const src = ref(
      "[<img src='https://example.com/image.png'>](https://example.com/image.png)"
    );
    const { html } = useMarkdown(src);
    const edited = useEditHtml(html, ref(""));
    const expected =
      "<p>" +
      '<a href="https://example.com/image.png" target="_blank">' +
      '<img src="https://example.com/image.png">' +
      "</a>" +
      "</p>\n";
    expect(edited.value).toBe(expected);
  });
});
