import clsx from 'clsx';
import Image from 'next/image';

import { GetOneNoteDto } from '@/Dto/Notes/GetOneNote.dto';
import { stringToDate } from '@/services/helper';

import { Card } from '../../Common/Card';

type Props = {
  note: GetOneNoteDto;
  handleOpenNoteEditor: () => void;
  handleClickDelete: (e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => void;
};
const NoteCard = ({ note, handleOpenNoteEditor, handleClickDelete }: Props) => {
  const formatedDate = stringToDate(note.updated);

  return (
    <Card
      onClick={handleOpenNoteEditor}
      className={clsx(['mb-6 mr-6 cursor-pointer hover:bg-bgSelected'])}
    >
      <div className='flex space-x-4'>
        <div>
          <p className='text-sm font-semibold capitalize'>{note.title}</p>

          {formatedDate && (
            <p className='text-xs text-[#FFFFFF80]'>{formatedDate}</p>
          )}
        </div>
        <div className='mt-[2px]'>
          <button onClick={handleClickDelete}>
            <Image
              src='/images/notes/close.svg'
              width={15}
              height={15}
              alt='delete group note'
            />
          </button>
        </div>
      </div>
    </Card>
  );
};
export { NoteCard };
