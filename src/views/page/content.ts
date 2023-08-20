import { computed, ref, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import $ from "jquery";

import { useMarkdownSource } from "./markdown-source";

export function useContent() {
  const route = useRoute();
  const cmsbook_url = ref(import.meta.env.VITE_CMSBOOK_URL);
  const { md } = useMarkdownSource();

  const content = computed(() => {
    let htmlString: string;
    try {
      htmlString = marked.parse(md.value);
    } catch (error) {
      return "cannot parsed as markdown";
    }

    try {
      return editHtml(htmlString);
    } catch (error) {
      console.error(error);
      return htmlString;
    }
  });

  function editHtml(htmlString: string) {
    const pathToCurrentDir = cmsbook_url.value + route.path.match(/.*\//);
    const ret = editHtmlWithJQuery(htmlString, pathToCurrentDir);
    return ret;
  }

  function editHtmlWithJQuery(htmlString: string, pathToCurrentDir: string) {
    let tree = $(`<div>${htmlString}</div>`);
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
  return { content };
}
