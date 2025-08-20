import { useReduxState } from '@/hooks/useReduxState';

import { GetOneGroupDtoWithStats } from '@/Dto/Notes/GetAllGoup.dto';
import { logger } from '@/services/logger';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { GroupList } from './Group/GroupList';
import { NoteList } from './Notes/NoteList';
import { Dialog } from '../Common/Dialog';
const NotesDialog = () => {
  const [{ currentGroup }, { update }] = useReduxState('currentGroup');

  const handleClose = () => update(['currentMenuIndex'], MenuItemsIndex.NONE);

  const handleOpenNotesGroup = (group: GetOneGroupDtoWithStats) => () => {
    logger('--- handleOpenNotesGroup ', group);
    update(['currentGroup'], group);
  };

  return (
    <Dialog withHeader={false} handleClose={handleClose}>
      <div className='flex downMd:h-[500px] upLg:min-h-[400px] upLg:w-[680px]'>
        {currentGroup ? (
          <NoteList group_id={currentGroup.id} />
        ) : (
          <GroupList
            handleClose={handleClose}
            handleOpenNotesGroup={handleOpenNotesGroup}
          />
        )}
      </div>
    </Dialog>
  );
};
export { NotesDialog };
