<!-- Changes in original code if something not going to work change this below codes -->

<!-- This is the code of editor that present in '/components/editor/index.tsx' -->
interface Props {
  value: string;
  editorRef?: Ref<MDXEditorMethods> | null; <!-- In this line '?' is added make sure to remove while write backend code -->
  fieldChange: (value: string) => void;
}

