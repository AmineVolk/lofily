import Image from 'next/image';

import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';

import { AudioListener } from '../common/Audio';

export const getTableColumns = (onClickDelete: (id: number) => void) => [
  {
    name: 'Cover',
    cell: (props: GetMusicDto) => {
      const { image_url } = props;
      return (
        <div className='max-w-[100px] rounded-md'>
          {image_url ? (
            <div className='flex h-[100px] max-w-[100px] items-center rounded-lg p-2'>
              <Image
                width={100}
                height={100}
                alt='cover'
                className='rounded-lg'
                src={image_url}
              />
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
    name: 'Title',
    selector: (row: GetMusicDto) => row.title,
  },
  {
    name: 'Artist',
    selector: (row: GetMusicDto) => row.artist,
  },
  {
    name: 'Duration',
    selector: (row: GetMusicDto) => row.duration_text || '0:00',
  },

  {
    name: 'Action',
    cell: (props: GetMusicDto) => {
      const audioUrl = props.url;

      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <AudioListener url={audioUrl} />

          <button onClick={() => onClickDelete(props.id)}>
            <Image
              width={20}
              height={20}
              src='/images/delete.svg'
              alt='delete'
            />
          </button>
        </div>
      );
    },
  },
];
