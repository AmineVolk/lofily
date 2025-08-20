import clsx from 'clsx';
import Image from 'next/image';

import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';

export const getTableColumns = (
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void
) => [
  {
    name: 'Cover',
    cell: (props: GetBackgroundDto) => {
      const { url } = props;
      return (
        <div className='max-w-[100px] rounded-md'>
          {url ? (
            <div className='flex h-[100px] max-w-[100px] items-center rounded-lg py-2'>
              <video
                className='rounded-lg'
                src={process.env.NEXT_PUBLIC_BACKEND_URL + url}
              ></video>
            </div>
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
    name: 'Cover mobile',
    cell: (props: GetBackgroundDto) => {
      const { url, url_mobile } = props;
      return (
        <div className='max-w-[100px] rounded-md'>
          {url ? (
            <div className='flex max-w-[100px] items-center rounded-lg py-2'>
              <video
                className='rounded-lg'
                src={process.env.NEXT_PUBLIC_BACKEND_URL + (url_mobile || url)}
              ></video>
            </div>
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    selector: (row: GetBackgroundDto) => row.categoryName,
  },
  {
    name: 'Used as default background',
    cell: ({ is_default }: GetBackgroundDto) => {
      return (
        <p
          className={clsx([
            'rounded-md p-2 capitalize text-white',
            is_default ? 'bg-[#36B37E]' : 'bg-[#FFAB00]',
          ])}
        >
          {is_default ? 'Yes' : 'No'}
        </p>
      );
    },
  },
  {
    name: 'Action',
    cell: (props: GetBackgroundDto) => {
      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <button onClick={() => onClickEdit(props.id)}>
            <Image width={20} height={20} src='/images/edit.svg' alt='edit' />
          </button>
          <button onClick={() => onClickDelete(props.id)}>
            <Image width={20} height={20} src='/images/delete.svg' alt='edit' />
          </button>
        </div>
      );
    },
  },
];
