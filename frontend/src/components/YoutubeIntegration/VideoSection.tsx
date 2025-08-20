import Image from 'next/image';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Rnd } from 'react-rnd';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxActions } from '@/hooks/useReduxState';

import { MAX_WIDTH_MOBILE } from '@/constant';
import { getYoutubeIdFromURL } from '@/services/helper';

const VideoSection = ({
  url,
  handleClickSearch,
  handleClose,
}: {
  url: string;
  handleClickSearch: () => void;
  handleClose: () => void;
}) => {
  const { update } = useReduxActions();
  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  return (
    <Rnd
      disableDragging={isMobile}
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
    >
      <div className='  overflow-auto rounded-md bg-primary-dark p-2 shadow-2xl '>
        <div className='bg-primary flex flex-1 cursor-move justify-end space-x-2 p-2'>
          <button onClick={handleClickSearch}>
            <Image
              src='/images/youtube/search.svg'
              width={14}
              height={14}
              alt='close'
            />
          </button>
          <button onClick={handleClose}>
            <Image
              src='/images/youtube/close.svg'
              width={14}
              height={14}
              alt='close'
            />
          </button>
        </div>
        <LiteYouTubeEmbed
          id={getYoutubeIdFromURL(url)}
          title='What’s new in Material Design for the web (Chrome Dev Summit 2019)'
        />
      </div>
    </Rnd>
  );
};
export { VideoSection };
