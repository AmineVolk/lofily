import { ReactNode } from 'react';
import { useIdleTimer } from 'react-idle-timer';

import { useReduxState } from '@/hooks/useReduxState';

import { logger } from '@/services/logger';

const WithInactivityDetection = ({ children }: { children: ReactNode }) => {
  const [{ user, isActive }, { update }] = useReduxState('user,isActive');
  logger('------- user?.hide_inactivity  ', user?.hide_inactivity);
  const handleOnIdle = () => {
    logger('--------- user is not active --------------');
    if (isActive) update(['isActive'], false);
  };

  const handleOnActive = () => {
    logger('user is active');
    if (!isActive) update(['isActive'], true);
  };

  useIdleTimer({
    timeout: (user?.hide_inactivity || 1440) * 1000,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });
  return <>{children}</>;
};
export { WithInactivityDetection };
