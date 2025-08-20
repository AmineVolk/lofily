import Image from 'next/image';
import { useEffect } from 'react';
import { Trans } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { GetOneGroupDtoWithStats } from '@/Dto/Notes/GetAllGoup.dto';
import { NoteGroupApi } from '@/services/api/NoteGroup';
import { logger } from '@/services/logger';

import { GroupCard } from './GroupCard';

type GroupListProps = {
  handleClose: () => void;
  handleOpenNotesGroup: (group: GetOneGroupDtoWithStats) => () => void;
};
const GroupList = ({ handleClose, handleOpenNotesGroup }: GroupListProps) => {
  const [{ noteGroups, currentGroup }, { update }] = useReduxState(
    'noteGroups,currentGroup'
  );
  const onClickAdd = () => {
    const lastGroup = noteGroups[noteGroups.length - 1];
    const body = {
      name: 'Note group name ' + ((lastGroup?.id || 0) + 1),
    };
    return NoteGroupApi.create(body).then(({ data }) => {
      update(['noteGroups'], [...noteGroups, data]);
    });
  };

  const handleEdit = () => {
    const groupToUpdate = noteGroups.find(
      (group) => group.id === currentGroup?.id
    );
    if (groupToUpdate) {
      NoteGroupApi.update(groupToUpdate.id, {
        name: groupToUpdate.name,
      });
    }
  };

  const onClickDelete = (id: number) => () => {
    logger('onClickDelete ');
    return NoteGroupApi.remove(id).then(() => {
      const newGroup = noteGroups.filter((group) => group.id !== id);
      update(['noteGroups'], newGroup);
    });
  };

  const onChangeName = (id: number) => (name: string) => {
    const newGroup = noteGroups.map((group) =>
      group.id === id ? { ...group, name } : group
    );
    update(['noteGroups'], newGroup);
  };

  useEffect(() => {
    NoteGroupApi.getAll().then(({ data }) => update(['noteGroups'], data));
  }, []);

  return (
    <div className='w-full'>
      <div className='mb-6 flex items-center  '>
        <p className='font-semibold capitalize'>
          <Trans i18nKey='note.title' />
        </p>
        <div className='flex flex-1 justify-end space-x-4'>
          <button onClick={onClickAdd}>
            <Image
              src='/images/notes/add.svg'
              width={24}
              height={24}
              alt='add note'
            />
          </button>

          <button onClick={handleClose}>
            <Image
              src='/images/notes/close.svg'
              width={24}
              height={24}
              alt='close popup notes'
            />
          </button>
        </div>
      </div>
      <div className='flex flex-wrap'>
        {noteGroups.map((group) => (
          <GroupCard
            name={group.name}
            nbr_notes={group.nbr_notes}
            key={group.id}
            onChangeName={onChangeName(group.id)}
            handleEdit={handleEdit}
            handleOpenNotesGroup={handleOpenNotesGroup(group)}
            onClickDelete={onClickDelete(group.id)}
          />
        ))}
      </div>
    </div>
  );
};
export { GroupList };
