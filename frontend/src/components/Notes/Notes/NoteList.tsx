import { convertFromHTML } from 'draft-convert';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useEffect, useState } from 'react';

import { GetOneNoteDto } from '@/Dto/Notes/GetOneNote.dto';
import { NoteApi } from '@/services/api/Notes';

import { NoteNavBar } from './NavBar';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';

type NoteListProps = {
  group_id: number;
};
const NoteList = ({ group_id }: NoteListProps) => {
  const [notes, setNotes] = useState<GetOneNoteDto[]>([]);
  const [selectedNote, setSelectedNote] = useState<GetOneNoteDto | null>(null);

  const [displayNoteEditor, setDisplayNoteEditor] = useState(false);

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(convertFromHTML(selectedNote?.content || ''))
  );
  const handleEdit = () => {
    const noteToUpdate = notes.find((group) => group.id === selectedNote?.id);
    if (noteToUpdate) {
      NoteApi.update(noteToUpdate.id, noteToUpdate);
    }
  };

  const onClickAdd = () => {
    const body = {
      title: 'Note name ' + (notes.length + 1),
      content: '',
      note_group_id: group_id,
    };
    return NoteApi.create(body).then(({ data }) => {
      setNotes([...notes, data]);
    });
  };

  const onClickDelete =
    (note: GetOneNoteDto) =>
    (e: { stopPropagation: () => void; preventDefault: () => void }) => {
      e.stopPropagation();
      e.preventDefault();
      return NoteApi.remove(note.id).then(() => {
        const newNotes = notes.filter((group) => group.id !== note?.id);
        setNotes(newNotes);
      });
    };

  const onChangeNoteNameState = (id: number) => (title: string) => {
    const newNotes = notes.map((note) =>
      note.id === id ? { ...note, title } : note
    );
    setNotes(newNotes);
    if (selectedNote) {
      const newSelectedNote = {
        ...selectedNote,
        title,
      };
      setSelectedNote(newSelectedNote);
    }
  };

  const handleOpenNoteEditor = (note: GetOneNoteDto) => () => {
    setDisplayNoteEditor(true);
    setSelectedNote(note);
    setEditorState(
      EditorState.createWithContent(convertFromHTML(note?.content || ''))
    );
  };

  const handleUpdateNoteContent = () => {
    if (selectedNote) {
      setDisplayNoteEditor(false);

      const body = {
        content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        title: selectedNote.title,
        note_group_id: selectedNote.note_group_id,
      };
      NoteApi.update(selectedNote.id, body).then(() => {
        const newNotes = notes.map((note) =>
          note.id === selectedNote.id
            ? { ...note, content: body.content }
            : note
        );
        setNotes(newNotes);
      });
    }
  };

  const handleContentChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const goToNotesList = () => {
    setDisplayNoteEditor(false);
  };

  useEffect(() => {
    NoteApi.getAll(group_id).then(({ data }) => {
      setNotes(data);
    });
  }, [group_id]);

  return (
    <div className='h-ful flex flex-1 flex-col overflow-auto' id='wrapper'>
      <NoteNavBar
        goToNotesList={goToNotesList}
        displayNoteEditor={displayNoteEditor}
        selectedNote={selectedNote}
        onClickAdd={onClickAdd}
        handleUpdateNoteContent={handleUpdateNoteContent}
        onChangeNoteNameState={onChangeNoteNameState}
      />
      {displayNoteEditor ? (
        <NoteEditor
          key={selectedNote?.id}
          handleContentChange={handleContentChange}
          editorState={editorState}
        />
      ) : (
        <div className='flex flex-wrap'>
          {notes.map((note) => (
            <NoteCard
              note={note}
              key={note.id}
              handleOpenNoteEditor={handleOpenNoteEditor(note)}
              handleClickDelete={onClickDelete(note)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export { NoteList };
