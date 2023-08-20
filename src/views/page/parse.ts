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
    tree.find("a:not([href^='#'])").attr("target", "_blank");

    tree
      .find(
        "a:not([href^='http:'],[href^='https:'],[href^='file:'],[href^='/'],[href^='#'])"
      )
      .each(function () {
        this.setAttribute(
          "href",
          this.getAttribute("href").replace(/^/, pathToCurrentDir)
        );
      });

    tree
      .find("img:not([src^='http:'],[src^='https:'],[src^='/'])")
      .each(function () {
        this.setAttribute(
          "src",
          this.getAttribute("src").replace(/^/, pathToCurrentDir)
        );
      });

    return tree.html();
  }
  return { content: parsed };
}
