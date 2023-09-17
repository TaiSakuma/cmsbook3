import { storeToRefs } from "pinia";
import { useStore } from "@/plugins/pinia/stores/main";
import { computed } from "vue";

interface ListItem {
  type: "item";
  title: string;
  to?: string;
  prependIcon?: string;
  appendIcon?: string;
}

interface ListGroup {
  type: "group";
  value: string;
  title: string;
  prependIcon?: string;
  appendIcon?: string;
  contents: (ListItem | ListGroup)[];
}

type ListContent = ListItem | ListGroup;

type ListContents = ListContent[];
export function useListContents() {
  const store = useStore();
  const { chapter, sections } = storeToRefs(store);

  const listContents = computed<ListContents>(() => {
    const chapterPath = chapter.value?.path;
    if (!chapterPath) return [];
    const _ret: ListContents = [];
    let groupCounter = 0; // for unique value
    sections.value.forEach((section) => {
      if (!("subcontents" in section)) {
        const to =
          "path" in section ? `${chapterPath}/${section.path}` : undefined;
        _ret.push({
          type: "item",
          title: section.name,
          prependIcon: "mdi-book",
          ...(to && { to }),
        });
      } else {
        const groupContents: ListContents = [];
        const groupValue = `${groupCounter++}-${section.name}`;
        _ret.push({
          type: "group",
          value: groupValue,
          title: section.name,
          prependIcon: "mdi-book-multiple",
          contents: groupContents,
        });
        const subsections = section.subcontents;
        subsections?.forEach((subsection) => {
          if (!("subcontents" in subsection)) {
            const to =
              "path" in subsection
                ? `${chapterPath}/${subsection.path}`
                : undefined;
            groupContents.push({
              type: "item",
              title: subsection.name,
              appendIcon: "mdi-book",
              ...(to && { to }),
            });
          } else {
            const subGroupContents: ListContents = [];
            const subGroupValue = `${groupCounter++}-${subsection.name}`;
            groupContents.push({
              type: "group",
              value: subGroupValue,
              title: subsection.name,
              contents: subGroupContents,
            });
            const subsubsections = subsection.subcontents;
            subsubsections.forEach((subsubsection) => {
              const to =
                "path" in subsubsection
                  ? `${chapterPath}/${subsubsection.path}`
                  : undefined;
              subGroupContents.push({
                type: "item",
                title: subsubsection.name,
                appendIcon: "mdi-book",
                ...(to && { to }),
              });
            });
          }
        });
      }
    });
    return _ret;
  });

  return { listContents };
}
