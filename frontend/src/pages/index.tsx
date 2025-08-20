import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

import { useAppRunningTime } from '@/hooks/useAppRunningTime';
import { useFetch } from '@/hooks/useFetch';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxState } from '@/hooks/useReduxState';

import { CircleMenu } from '@/components/CircularButton';
import { VideoPlayer } from '@/components/Common/VideoPlayer';
import { EffectsDialog } from '@/components/Effects';
import { ListenEffects } from '@/components/Effects/ListenEffects';
import Layout from '@/components/Layout';
import { LofimonDialog } from '@/components/Lofimon';
import { LoginDialog } from '@/components/LoginSignup';
import { NotesDialog } from '@/components/Notes';
import { PremiumDescriptionDialog } from '@/components/PremiumDescription';
import { ScenesDialog } from '@/components/Scenes';
import { SettingsDialog } from '@/components/Settings';
import { StatsDialog } from '@/components/Stats';
import { Timer } from '@/components/Timer';
import { WithInactivityDetection } from '@/components/withInactiviyDetection';
import { YoutubeIntegration } from '@/components/YoutubeIntegration';

import { MAX_WIDTH_MOBILE } from '@/constant';
import { GetBackgroundDto } from '@/Dto/GetBackground.dto';
import { AuthApi } from '@/services/api/Auth';
import { UserMusicEffectApi } from '@/services/api/UserMusicEffect';
import { getFromLocalStorage } from '@/services/helper';
import { logger } from '@/services/logger';
import { getUserBackgroundUrl, isUserPremium } from '@/services/premium_helper';
import { MenuItemsIndex } from '@/services/redux-state/Store';
import { DynamicComponentType } from '@/type';

export default function HomePage() {
  useAppRunningTime();
  const router = useRouter();
  const [
    {
      currentMenuIndex,
      displayTimer,
      displayYoutube,
      user,
      freeBackgroundUrl,
      freeBackgroundUrlMobile,
    },
    { update },
  ] = useReduxState(
    'currentMenuIndex,displayTimer,displayYoutube,user,effects,musicStatus,freeBackgroundUrl,freeBackgroundUrlMobile'
  );

  const isMobile = useMediaQuery(`(max-width: ${MAX_WIDTH_MOBILE}px)`);

  const isPremium = isUserPremium(user);

  const { data: defaultBackground } = useFetch<GetBackgroundDto>(
    '/background/default'
  );

  useEffect(() => {
    const displayTimer = getFromLocalStorage('displayTimer');
    if (displayTimer) {
      update(['displayTimer'], JSON.parse(displayTimer));
    }

    UserMusicEffectApi.getAll().then((effects) => update(['effects'], effects));
  }, []);

  useEffect(() => {
    window.addEventListener('unload', handleTabClosing);
    return () => {
      window.removeEventListener('unload', handleTabClosing);
    };
  });

  useEffect(() => {
    if (router.query.token) {
      handleConfirmRegister(router.query.token.toString());
    }
    if (router.query.reset_token) {
      update(['currentMenuIndex'], MenuItemsIndex.PROFILE);
    }
  }, [router.query.token, router.query.reset_token]);

  const handleConfirmRegister = (token: string) => {
    AuthApi.confirmRegister(token).then(() => {
      update(['currentMenuIndex'], MenuItemsIndex.PROFILE);
      // used to delete the token from the url
      history.pushState({}, '', '/');
    });
  };

  const handleTabClosing = async () => {
    localStorage.setItem('displayTimer', displayTimer.toString());
  };

  const displayDialogByMenuItem = (): DynamicComponentType => ({
    0: () => <div />,
    1: () => <EffectsDialog />,
    2: () =>
      isPremium ? (
        <NotesDialog />
      ) : (
        <PremiumDescriptionDialog featureIndex={MenuItemsIndex.NOTES} />
      ),
    3: () =>
      isPremium ? (
        <StatsDialog />
      ) : (
        <PremiumDescriptionDialog featureIndex={MenuItemsIndex.STATS} />
      ),
    4: () => <LoginDialog />,
    5: () => <SettingsDialog />,
    6: () =>
      isPremium ? (
        <div />
      ) : (
        <PremiumDescriptionDialog featureIndex={MenuItemsIndex.TIMER} />
      ),
    7: () => <ScenesDialog />,
    8: () =>
      isPremium ? (
        <div />
      ) : (
        <PremiumDescriptionDialog featureIndex={MenuItemsIndex.YOUTUBE} />
      ),
    9: () =>
      isPremium ? (
        <LofimonDialog />
      ) : (
        <PremiumDescriptionDialog featureIndex={MenuItemsIndex.LOFIMON} />
      ),
  });

  const displayDialog = displayDialogByMenuItem()[currentMenuIndex]();

  const defaultBackgroundUrl = defaultBackground
    ? process.env.NEXT_PUBLIC_BACKEND_URL +
      (isMobile ? defaultBackground.url_mobile : defaultBackground.url)
    : '';

  const userBackgroundUrl = getUserBackgroundUrl(
    isMobile,
    user,
    isMobile && freeBackgroundUrlMobile
      ? freeBackgroundUrlMobile
      : freeBackgroundUrl
  );

  const url = userBackgroundUrl || defaultBackgroundUrl;
  logger('******* main page ', {
    userBackgroundUrl,
    url,
    user,
    freeBackgroundUrl,
    isMobile,
  });
  return (
    <Layout>
      <WithInactivityDetection>
        <div>
          {url && (
            <VideoPlayer
              autoPlay={true}
              loop={true}
              controls={false}
              playsInline
              muted
              id='background-video'
              className='absolute top-0 left-0 h-full w-full object-cover'
              url={url}
            />
          )}
          {displayDialog}
          {displayTimer && isPremium && <Timer />}
          {displayYoutube && isPremium && <YoutubeIntegration />}

          <CircleMenu />
          <ListenEffects />
        </div>
      </WithInactivityDetection>
    </Layout>
  );
}
export type LocalProps = {
  locale: string;
};
export async function getStaticProps({ locale }: LocalProps) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
