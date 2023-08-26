import { computed, ref, toValue, MaybeRefOrGetter } from "vue";
import { marked } from "marked";
import $ from "jquery";

export function useParse(
  md: MaybeRefOrGetter<string>,
  pathToCurrentDir: MaybeRefOrGetter<string>
) {
  const parsed = computed(() => {
    let htmlString: string;
    try {
      htmlString = marked.parse(toValue(md));
    } catch (error) {
      return `cannot parsed as markdown: ${error}`;
    }

    try {
      return editHtml(htmlString);
    } catch (error) {
      return `<div class="alert alert-danger" role="alert">${error}</div>${htmlString}`;
    }
  });

  function editHtml(htmlString: string) {
    const ret = editHtmlWithJQuery(htmlString, toValue(pathToCurrentDir));
    return ret;
  }

  function editHtmlWithJQuery(htmlString: string, pathToCurrentDir: string) {
    const tree = $(`<div>${htmlString}</div>`);

    // Open external links in new tab
    tree.find("a:not([href^='#'])").attr("target", "_blank");

    // Add mdi-open-in-new icon after links with target="_blank" on text (not img)
    tree.find("a[target='_blank']:not(:has(img))").each(function () {
      $(this).append(
        ` <i class="mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall " aria-hidden="true"></i>`
      );
    });

    // Replace relative links with absolute links
    tree
      .find(
        "a:not([href^='http:'],[href^='https:'],[href^='file:'],[href^='/'],[href^='#'])"
      )
      .each(function () {
        const attr = this.getAttribute("href");
        if (!attr) return;
        this.setAttribute("href", attr.replace(/^/, pathToCurrentDir));
      });

    // Replace relative links with absolute links for images
    tree
      .find("img:not([src^='http:'],[src^='https:'],[src^='/'])")
      .each(function () {
        const attr = this.getAttribute("src");
        if (!attr) return;
        this.setAttribute("src", attr.replace(/^/, pathToCurrentDir));
      });

    return tree.html();
  }
  return { content: parsed };
}
