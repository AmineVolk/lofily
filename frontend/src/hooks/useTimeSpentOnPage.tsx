import { useEffect, useState } from 'react';

import { EventType } from '@/Dto/EventTrack/CreateEventTrack.dto';
import { EventTrackApi } from '@/services/api/EventTrack';
import { logger } from '@/services/logger';

const TIMOUT_CHECK_MILISECONDES = 1000; // each minute

const useTimeSpentOnPage = () => {
  const [time, setTime] = useState(0);
  const [pageLoadTime, setPageLoadTime] = useState(Date.now());
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        const timeInMinutes = Math.floor((Date.now() - pageLoadTime) / 60000);
        logger('useTimeSpentOnApp timeInMinutes ', timeInMinutes);

        if (timeInMinutes !== time && timeInMinutes > 0) {
          setTime(timeInMinutes);
        }
      }
    }, TIMOUT_CHECK_MILISECONDES);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, pageLoadTime, time]);

  logger('useTimeSpentOnApp user spent(minutes) ', time);

  const addEventTrack = () => {
    EventTrackApi.createTimeSpentEvent({
      type: EventType.TIME_SPENT_ON_APP,
      minute_spent: time,
    });
  };
  useEffect(() => {
    logger('useTimeSpentOnApp time spent changer, new value ', time);
    addEventTrack();
    const handleVisibilityChange = async () => {
      setIsActive(!document.hidden);
      if (!document.hidden) {
        setPageLoadTime(Date.now() - time);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [time]);
};

export { useTimeSpentOnPage };
