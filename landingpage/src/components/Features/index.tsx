import { useTranslation } from 'react-i18next';

import { ImageDescription } from './ImageDescription';

const Features = () => {
  const { t } = useTranslation('common');
  const FeaturesData = [
    {
      image: '/images/features/music.svg',
      title: t('features.music.title'),
      description: t('features.music.description'),
      imageLeft: true,
    },
    {
      image: '/images/features/backgrounds.svg',
      title: t('features.backgrounds.title'),
      description: t('features.backgrounds.description'),
      imageLeft: false,
    },
    {
      image: '/images/features/effects.svg',
      title: t('features.effects.title'),
      description: t('features.effects.description'),
      imageLeft: true,
    },
    {
      image: '/images/features/stats.svg',
      title: t('features.statistics.title'),
      description: t('features.statistics.description'),
      imageLeft: false,
    },

    {
      image: '/images/features/notes.svg',
      title: t('features.notes.title'),
      description: t('features.notes.description'),
      imageLeft: true,
    },
    {
      image: '/images/features/youtube.svg',
      title: t('features.youtube.title'),
      description: t('features.youtube.description'),
      imageLeft: false,
    },
    {
      image: '/images/features/timer.svg',
      title: t('features.timer.title'),
      description: t('features.timer.description'),
      imageLeft: true,
    },
    {
      image: '/images/features/lofimon.svg',
      title: t('features.lofimon.title'),
      description: t('features.lofimon.description'),
      imageLeft: false,
    },
  ];
  return (
    <div className='mt-32 flex w-full flex-1 flex-col space-y-32'>
      {FeaturesData.map((feature) => (
        <ImageDescription {...feature} key={feature.title} />
      ))}
    </div>
  );
};

export { Features };
