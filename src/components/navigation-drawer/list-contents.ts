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

function useCreateGroupValue() {
  // for unique values of VListGroup for expand / collapse
  let counter = 0;
  const create = (name: string) => `${counter++}-${name}`;
  const reset = () => (counter = 0);
  return { create, reset };
}

export function useListContents() {
  const store = useStore();
  const { chapter, sections } = storeToRefs(store);
  const { create: createGroupValue, reset: resetGroupValue } =
    useCreateGroupValue();

  type Section = (typeof sections.value)[0];
  type Path = Extract<Section, { path: string }>;
  type SubSection = Exclude<Section, Path>;

  const createListItem = (chapterPath: string, section: Path): ListItem => {
    const to = `${chapterPath}/${section.path}`;
    return {
      type: "item" as const,
      title: section.name,
      prependIcon: "mdi-book",
      ...(to && { to }),
    };
  };

  const createListGroup = (
    chapterPath: string,
    section: SubSection
  ): ListGroup => {
    const groupValue = createGroupValue(section.name);
    const groupContents =
      section.subcontents?.map((subsection) =>
        "path" in subsection
          ? createListItem(chapterPath, subsection)
          : createListGroup(chapterPath, subsection)
      ) ?? [];
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
    resetGroupValue();
    return sections.value.map((section) =>
      "path" in section
        ? createListItem(chapterPath, section)
        : createListGroup(chapterPath, section)
    );
  });

  return { listContents };
}
