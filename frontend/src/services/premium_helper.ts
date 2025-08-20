import { GetUserDto } from '@/Dto/User/GetUser.dto';
import { USER_TYPE } from '@/enum';

import { getFromLocalStorage } from './helper';

const getUserFromLocalStorage = (): GetUserDto | null => {
  const userString: string | null = getFromLocalStorage('user');
  const user: GetUserDto | null = userString ? JSON.parse(userString) : null;
  return user;
};

const isUserPremium = (user: GetUserDto | null): boolean =>
  Boolean(
    user && (user.type === USER_TYPE.PREMIUM || user.type === USER_TYPE.ADMIN)
  );

const getUserBackgroundUrl = (
  isMobile?: boolean,
  user?: GetUserDto | null,
  freeBackgroundUrl?: string
): string | null => {
  if (!user) {
    return freeBackgroundUrl
      ? process.env.NEXT_PUBLIC_BACKEND_URL + freeBackgroundUrl
      : null;
  } else {
    if (isMobile && user.background_url_mobile) {
      return process.env.NEXT_PUBLIC_BACKEND_URL + user.background_url_mobile;
    }

    return user.background_url
      ? process.env.NEXT_PUBLIC_BACKEND_URL + user.background_url
      : null;
  }
};

export { getUserBackgroundUrl, getUserFromLocalStorage, isUserPremium };
