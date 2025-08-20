import clsx from 'clsx';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const MusicInfos = ({
  artiste,
  title,
  image,
  artist_link,
}: {
  artiste?: string;
  title?: string;
  image?: string;
  artist_link?: string;
}) => {
  const { t } = useTranslation('common');
  return (
    <a
      className={clsx([
        ` absolute left-10 bottom-4 flex  space-x-2 rounded-md bg-primary-dark p-2   
    downSm:w-[205px]
    upMd:w-[228px]
    downMd:bottom-20 downMd:left-1/2 downMd:-translate-x-1/2 downMd:transform`,
        artist_link && 'underline',
      ])}
      href={artist_link}
      target='_blank'
    >
      {image && (
        <Image
          className='mr-2 rounded-md'
          src={image}
          alt={title + 'image'}
          height={40}
          width={40}
        />
      )}
      <div>
        <p className='max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap font-spartan text-[14px] font-bold capitalize  downSm:max-w-[120px]'>
          {title}
        </p>
        <p className='max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap font-spartan text-[10px]  capitalize downSm:max-w-[120px]'>
          {artiste || t('unknown_artist')}
        </p>
      </div>
    </a>
  );
};
export { MusicInfos };
