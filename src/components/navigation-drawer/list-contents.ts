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

  let _groupCounter = 0; // for unique value

  type Section = (typeof sections.value)[0];
  type Path = Extract<Section, { path: string }>;
  type SubSection = Exclude<Section, Path>;

  const createListItem = (chapterPath: string, section: Path) => {
    const to = `${chapterPath}/${section.path}`;
    return {
      type: "item" as const,
      title: section.name,
      prependIcon: "mdi-book",
      ...(to && { to }),
    };
  };

  const createListGroup = (chapterPath: string, section: SubSection) => {
    const groupContents: ListContents = [];
    const groupValue = `${_groupCounter++}-${section.name}`;
    const subsections = section.subcontents;
    subsections?.forEach((subsection) => {
      if ("path" in subsection) {
        groupContents.push(createListItem(chapterPath, subsection));
      } else {
        groupContents.push(createListGroup(chapterPath, subsection));
      }
    });
    return {
      type: "group" as const,
      value: groupValue,
      title: section.name,
      prependIcon: "mdi-book-multiple",
      contents: groupContents,
    };
  };

  const listContents = computed<ListContents>(() => {
    const chapterPath = chapter.value?.path;
    if (!chapterPath) return [];
    const _ret: ListContents = [];
    _groupCounter = 0; // for unique value
    sections.value.forEach((section) => {
      if ("path" in section) {
        _ret.push(createListItem(chapterPath, section));
      } else {
        _ret.push(createListGroup(chapterPath, section));
      }
    });
    return _ret;
  });

  return { listContents };
}
