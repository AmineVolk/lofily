import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useClickOutside } from 'react-click-outside-hook';

import { useReduxState } from '@/hooks/useReduxState';

import { GetOneNoteDto } from '@/Dto/Notes/GetOneNote.dto';
import { NoteGroupApi } from '@/services/api/NoteGroup';
import { NoteApi } from '@/services/api/Notes';
import { MenuItemsIndex } from '@/services/redux-state/Store';

const NoteNavBar = ({
  displayNoteEditor,
  selectedNote,
  onClickAdd,
  handleUpdateNoteContent,
  onChangeNoteNameState,
  goToNotesList,
}: {
  displayNoteEditor: boolean;
  selectedNote: GetOneNoteDto | null;
  onClickAdd: () => void;
  handleUpdateNoteContent: () => void;
  onChangeNoteNameState: (id: number) => (title: string) => void;
  goToNotesList: () => void;
}) => {
  const [{ currentGroup }, { update }] = useReduxState(
    'noteGroups,currentGroup'
  );
  const handleClose = () => update(['currentMenuIndex'], MenuItemsIndex.NONE);

  const [refInputNote, hasClickedOutsideNoteInput] = useClickOutside();
  const [refGroupNote, hasClickedOutsideGroupInput] = useClickOutside();

  const [editGroupName, setEditGroupName] = useState(false);
  const [editNoteName, setEditNoteName] = useState(false);
  const handleSaveNoteName = () => {
    if (selectedNote) {
      NoteApi.update(selectedNote.id, selectedNote).then(() =>
        setEditNoteName(false)
      );
    }
  };

  const handleSaveGroupName = () => {
    if (currentGroup) {
      NoteGroupApi.update(currentGroup.id, { name: currentGroup?.name });
      setEditGroupName(false);
    }
  };

  const onGroupNameChange = (newName: string) => {
    update(['currentGroup', 'name'], newName);
  };

  useEffect(() => {
    if (hasClickedOutsideNoteInput && editNoteName) {
      handleSaveNoteName();
    }
    if (hasClickedOutsideGroupInput && editGroupName) {
      handleSaveGroupName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasClickedOutsideNoteInput,
    hasClickedOutsideGroupInput,
    editNoteName,
    editGroupName,
  ]);

  const getToGroupsList = () => {
    update(['currentGroup'], null);
  };

  return (
    <div className='mb-6 flex items-center'>
      <div className='flex flex-1 items-center '>
        <button
          onClick={displayNoteEditor ? goToNotesList : getToGroupsList}
          className='absolute left-1'
        >
          <Image
            src='/images/notes/back.svg'
            width={36}
            height={36}
            alt='back'
          />
        </button>

        {displayNoteEditor &&
          (editNoteName && selectedNote ? (
            <input
              ref={refInputNote}
              className='ml-4 w-full max-w-[600px] border-0 bg-primary-dark p-1 outline-none'
              value={selectedNote?.title}
              autoFocus
              onChange={(e) =>
                onChangeNoteNameState(selectedNote.id)(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveNoteName();
                }
              }}
            />
          ) : (
            <p
              className='ml-4 flex cursor-text space-x-2 font-semibold capitalize last:text-sm'
              onClick={() => setEditNoteName(true)}
            >
              <span>{selectedNote?.title} </span>
              <Image
                className='cursor-pointer'
                src='/images/pen-edit.svg'
                alt='edit icon'
                width={12}
                height={12}
              />
            </p>
          ))}

        {!displayNoteEditor &&
          (editGroupName ? (
            <input
              ref={refGroupNote}
              className='sborder-0 ml-4 w-full overflow-x-auto  text-ellipsis bg-primary-dark p-1 outline-none'
              value={currentGroup?.name}
              autoFocus
              onChange={(e) => onGroupNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  return handleSaveGroupName();
                }
              }}
            />
          ) : (
            <p
              className='ml-4 flex cursor-text space-x-2 font-semibold capitalize last:text-sm'
              onClick={() => setEditGroupName(true)}
            >
              <span> {currentGroup?.name}</span>
              <Image
                className='cursor-pointer'
                src='/images/pen-edit.svg'
                alt='edit icon'
                width={12}
                height={12}
              />
            </p>
          ))}
      </div>
      <div className='flex justify-end space-x-4'>
        {displayNoteEditor && (
          <button onClick={handleUpdateNoteContent}>
            <Image
              src='/images/notes/check.svg'
              width={24}
              height={24}
              alt='add note'
            />
          </button>
        )}
        {!displayNoteEditor && (
          <button onClick={onClickAdd}>
            <Image
              src='/images/notes/add.svg'
              width={24}
              height={24}
              alt='add note'
            />
          </button>
        )}

        <button onClick={handleClose}>
          <Image
            src='/images/notes/close.svg'
            width={24}
            height={24}
            alt={'close group ' + currentGroup?.name}
          />
        </button>
      </div>
    </div>
  );
};
export { NoteNavBar };
