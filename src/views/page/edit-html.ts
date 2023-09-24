import { MaybeRef, computed, unref } from "vue";
import $ from "jquery";

export function useEditHtml(
  html: MaybeRef<string>,
  pathToCurrentDir: MaybeRef<string>
) {
  const edited = computed(() =>
    editWithJQuery(unref(html), unref(pathToCurrentDir))
  );
  return edited;
}

const newTabIcon = `<i class="mdi-open-in-new mdi v-icon notranslate v-icon--size-xsmall" aria-hidden="true"></i>`;

function editWithJQuery(htmlString: string, pathToCurrentDir: string) {
  const tree = $(`<div>${htmlString}</div>`);

  // Open external links in new tab
  tree.find("a:not([href^='#'])").attr("target", "_blank");

  // Add an icon after links with target="_blank" on text (not img)
  tree.find("a[target='_blank']:not(:has(img))").each(function () {
    $(this).append(` ${newTabIcon}`); // Add space before icon
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
