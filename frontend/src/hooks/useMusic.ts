import { useEffect, useState } from 'react';

import { MUSIC_PAGINATION_LIMIT } from '@/constant';
import { GetMusicDto, GetMusicPagination } from '@/Dto/Music/GetMusic.dto';
import { MusicApi } from '@/services/api/Music';
import { logger } from '@/services/logger';

const useMusic = (): {
  currentMusic: undefined | GetMusicDto;
  next: () => void;
  previous: () => void;
  getRandomMusic: () => Promise<void>;
} => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState<number>(0);
  const [musicResponse, setMusicResponse] = useState<GetMusicPagination>({
    data: [],
    total: 0,
    page: 0,
    limit: MUSIC_PAGINATION_LIMIT,
  });

  const maxPage = Math.ceil(musicResponse.total / musicResponse.limit);

  const shouldFetchNextPage = currentMusicIndex > musicResponse.data.length - 1;

  const shouldGetPreviousPage =
    musicResponse.page > 1 && currentMusicIndex === -1;

  const isTheLastMusic =
    musicResponse.page === maxPage &&
    currentMusicIndex === musicResponse.data.length - 1;

  logger('useMusic ', { currentMusicIndex, isTheLastMusic });

  const getPage = (): number => {
    let result = musicResponse.page;
    if (musicResponse.page > maxPage) result = 1;
    if (shouldGetPreviousPage) result = musicResponse.page - 1;
    if (shouldFetchNextPage) result = musicResponse.page + 1;
    logger('getPage result ', result);
    return result > maxPage ? 1 : result;
  };

  const next = () => {
    if (typeof currentMusicIndex === 'number') {
      if (
        maxPage === 1 &&
        currentMusicIndex === musicResponse.data.length - 1
      ) {
        setCurrentMusicIndex(0);
      } else {
        setCurrentMusicIndex(currentMusicIndex + 1);
      }
    }
  };

  const previous = () => {
    if (typeof currentMusicIndex === 'number') {
      if (musicResponse.page !== 1 || currentMusicIndex !== 0) {
        setCurrentMusicIndex(currentMusicIndex - 1);
      }
    }
  };

  const lastMusic = musicResponse.data[musicResponse.data.length - 1];

  const musicByIndex = musicResponse.data?.length
    ? musicResponse.data?.find((_, index) => index === currentMusicIndex)
    : undefined;

  const currentMusic = shouldFetchNextPage ? lastMusic : musicByIndex;
  const resetCurrentMusicIndexAfterFetch = () => {
    if (shouldFetchNextPage || isTheLastMusic) {
      setCurrentMusicIndex(0);
    }
    if (shouldGetPreviousPage) {
      setCurrentMusicIndex(musicResponse.data.length - 1);
    }
  };

  // used only to trigger new call, the backend dont use the page, beacause we need to get random music.
  const pageToFetch = getPage();

  const getRandomMusic = async () => {
    try {
      const randomMusic = await MusicApi.getRandom(1);
      if (randomMusic && randomMusic.length > 0) {
        setMusicResponse({
          data: randomMusic,
          total: 1,
          page: 1,
          limit: 1,
        });
        setCurrentMusicIndex(0);
      }
    } catch (error) {
      logger('Error fetching random music:', error);
    }
  };

  const getMusic = async () => {
    logger('-----------------------------------pageToFetch  ', pageToFetch);
    // Utiliser la randomisation côté backend pour avoir des musiques différentes à chaque fois
    MusicApi.getAll(musicResponse.limit, pageToFetch, true)
      .then((result) => {
        setMusicResponse(result);
        resetCurrentMusicIndexAfterFetch();
      })
      .catch((error) => {
        logger('Error fetching music:', error);
        // En cas d'erreur, essayer sans random
        MusicApi.getAll(musicResponse.limit, pageToFetch, false).then(
          (result) => {
            setMusicResponse(result);
            resetCurrentMusicIndexAfterFetch();
          }
        );
      });
  };

  useEffect(() => {
    getMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageToFetch]);

  return {
    currentMusic,
    next,
    previous,
    getRandomMusic,
  };
};

export { useMusic };
