import { KeyboardEvent, useState } from 'react';

import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

import { useReduxActions } from '@/hooks/useReduxState';

import { validateYouTubeUrl } from '@/services/helper';
import { logger } from '@/services/logger';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { SearchUrl } from './SearchUrl';
import { VideoSection } from './VideoSection';

const YoutubeIntegration = () => {
  const [url, setUrl] = useState<string>('');
  const [urlValid, seturlValid] = useState(false);
  const { update } = useReduxActions();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (url) {
        const isUrlValid = validateYouTubeUrl(url);
        logger('----------- isUrlValid', isUrlValid);
        if (isUrlValid) {
          seturlValid(true);
        } else {
          seturlValid(false);
          setUrl('');
        }
      }
    }
  };

  const handleClickSearch = () => {
    setUrl('');
    seturlValid(false);
  };

  const handleClose = () => {
    update(['displayYoutube'], false);
    update(['currentMenuIndex'], MenuItemsIndex.NONE);
  };
  return (
    <div className='max-h-[70vh] max-w-[380px] '>
      {url && urlValid ? (
        <VideoSection
          url={url}
          handleClickSearch={handleClickSearch}
          handleClose={handleClose}
        />
      ) : (
        <SearchUrl
          handleKeyDown={handleKeyDown}
          setUrl={setUrl}
          url={url}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};
export { YoutubeIntegration };
