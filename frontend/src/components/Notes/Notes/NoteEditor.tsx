import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const NoteEditor = ({
  handleContentChange,
  editorState,
}: {
  handleContentChange: (newEditorState: EditorState) => void;
  editorState: EditorState;
}) => {
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={handleContentChange}
      toolbarClassName='toolbarClassName'
      wrapperClassName='wrapperClassName'
      editorClassName='editorClassName'
      toolbar={{
        options: ['inline', 'list', 'textAlign', 'history'],
        inline: {
          inDropdown: false,
          options: ['bold', 'italic', 'underline'],
        },
        textAlign: { inDropdown: false },
        link: { inDropdown: false },
        history: { inDropdown: false },
      }}
    />
  );
};
export { NoteEditor };
