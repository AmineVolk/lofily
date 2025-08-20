import clsx from 'clsx';
import Image from 'next/image';
import { Trans } from 'react-i18next';

import { Card } from '../../Common/Card';

type Props = {
  name: string;
  nbr_notes: number;
  onChangeName: (name: string) => void;
  handleEdit: () => void;
  handleOpenNotesGroup: () => void;
  onClickDelete: () => void;
};
const GroupCard = ({
  name: title,
  nbr_notes,

  handleOpenNotesGroup,
  onClickDelete,
}: Props) => {
  const handleClickDelete = (e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => {
    e.stopPropagation();
    e.preventDefault();
    onClickDelete();
  };

  return (
    <div className='mr-4 mb-4'>
      <Card
        className={clsx(['cursor-pointer hover:bg-bgSelected'])}
        onClick={handleOpenNotesGroup}
      >
        <div className='flex space-x-4'>
          <div>
            <p className='text-sm font-semibold capitalize'>{title}</p>
            <p className='text-xs text-[#FFFFFF80]'>
              {nbr_notes} <Trans i18nKey='note.title' />
            </p>
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
    </div>
  );
};
export { GroupCard };
