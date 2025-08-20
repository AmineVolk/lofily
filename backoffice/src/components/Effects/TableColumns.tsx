import Image from 'next/image';

import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';

import { AudioListener } from '../common/Audio';

export const getTableColumns = (
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void
) => [
  {
    name: 'Name',
    cell: (props: GetEffectDto) => (
      <p className='text-md font-bold capitalize'>{props.name}</p>
    ),
  },

  {
    name: 'Action',
    cell: (props: GetEffectDto, index: number) => {
      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <button onClick={() => onClickEdit(index)}>
            <Image width={20} height={20} src='/images/edit.svg' alt='edit' />
          </button>
          <button onClick={() => onClickDelete(index)}>
            <Image width={20} height={20} src='/images/delete.svg' alt='edit' />
          </button>
        </div>
      );
    },
  },
  {
    name: 'Listen',
    cell: (props: GetEffectDto, index: number) => {
      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <AudioListener
            url={process.env.NEXT_PUBLIC_BACKEND_URL + props.url}
          />
        </div>
      );
    },
  },
];
