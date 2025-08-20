import { useEffect, useState } from 'react';

import { EventType } from '@/Dto/EventTrack/CreateEventTrack.dto';
import { EventTrackApi } from '@/services/api/EventTrack';

const NBR_MINUTES = 5;
const TIMOUT_CHECK_MILISECONDES = 1000 * 60 * NBR_MINUTES; // 5 minutes
const useAppRunningTime = () => {
  const addEventTrack = (time: number) => {
    EventTrackApi.createTimeSpentEvent({
      type: EventType.TIME_SPENT_ON_APP,
      minute_spent: time,
    });
  };

  const [sepentTime, setSepentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpentTime = sepentTime + NBR_MINUTES;
      setSepentTime(newSpentTime);
      return addEventTrack(NBR_MINUTES);
    }, TIMOUT_CHECK_MILISECONDES);

    return () => {
      clearInterval(interval);
    };
  }, [sepentTime]);
};
export { useAppRunningTime };
