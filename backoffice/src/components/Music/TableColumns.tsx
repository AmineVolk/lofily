import Image from 'next/image';
import { useRef, useState } from 'react';

import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';

const PlayPauseButton = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Erreur lors de la lecture audio:', error);
      });
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handlePlayPause}
      className='rounded-full bg-blue-500 p-2 transition-colors hover:bg-blue-600'
      title={isPlaying ? 'Mettre en pause' : 'Écouter la musique'}
    >
      {isPlaying ? (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='text-white'
        >
          <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
        </svg>
      ) : (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='text-white'
        >
          <path d='M8 5v14l11-7z' />
        </svg>
      )}
    </button>
  );
};

export const getTableColumns = (onClickDelete: (id: number) => void) => [
  {
    name: 'Cover',
    cell: (props: GetMusicDto) => {
      const { image_url } = props;
      return (
        <div className='max-w-[100px] rounded-md'>
          {image_url ? (
            <div className='flex h-[100px] max-w-[100px] items-center rounded-lg py-2'>
              <Image
                width={100}
                height={100}
                alt='cover'
                className='rounded-lg'
                src={process.env.NEXT_PUBLIC_BACKEND_URL + image_url}
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
      const audioUrl = process.env.NEXT_PUBLIC_BACKEND_URL + props.url;

      return (
        <div className='flex flex-1 justify-start space-x-4'>
          <PlayPauseButton audioUrl={audioUrl} />
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
