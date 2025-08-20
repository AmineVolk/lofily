import clsx from 'clsx';
import Image from 'next/image';

import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { BgType } from '@/type';

export const getTableColumns = (
  onClickEditBackground: (id: number) => void,
  onClickDeleteBackground: (id: number) => void
) => [
  {
    name: 'Cover',
    cell: ({ thumbnail, id }: GetCategoryDto) => {
      return (
        <div>
          {thumbnail ? (
            <Image
              width={100}
              height={100}
              src={thumbnail}
              alt='cover'
              className='my-2 rounded-lg'
              loader={() => process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail}
            />
          ) : (
            <Image
              width={100}
              height={100}
              src='/images/no-image.png'
              alt='cover'
              className='my-2 rounded-lg'
            />
          )}
        </div>
      );
    },
  },
  {
    name: 'Category',
    selector: ({ name }: GetCategoryDto) => name,
  },
  {
    name: 'Number of backgrounds',
    selector: ({ nbr_backgrounds }: GetCategoryDto) => nbr_backgrounds,
  },
  {
    name: 'Type',
    cell: ({ is_for_premium }: GetCategoryDto) => {
      return (
        <p
          className={clsx([
            'rounded-md p-2 capitalize text-white',
            is_for_premium ? 'bg-[#FFAB00]' : 'bg-[#36B37E]',
          ])}
        >
          {is_for_premium ? BgType.PRIMUIM : BgType.FREE}
        </p>
      );
    },
  },
  {
    name: 'New',
    cell: ({ is_new }: GetCategoryDto) => {
      return (
        <p>
          {is_new ? (
            <div className='rounded-md  border bg-secondary-base  p-2  text-white'>
              YES
            </div>
          ) : (
            <div className='rounded-md bg-gray-200  p-2'>NO</div>
          )}
        </p>
      );
    },
  },
  {
    name: 'Action',

    cell: ({ nbr_backgrounds }: GetCategoryDto, index: number) => {
      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <button onClick={() => onClickEditBackground(index)}>
            <Image width={20} height={20} src='/images/edit.svg' alt='edit' />
          </button>
          {nbr_backgrounds < 1 && (
            <button onClick={() => onClickDeleteBackground(index)}>
              <Image
                width={20}
                height={20}
                src='/images/delete.svg'
                alt='edit'
              />
            </button>
          )}
        </div>
      );
    },
  },
];
