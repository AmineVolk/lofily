import { Trans, useTranslation } from 'react-i18next';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import { useIsMounted } from '@/hooks/useIsMounted';

import { TestimonialCard } from './Card';
const Testimonals = () => {
  const { t } = useTranslation('common');
  const [mounted] = useIsMounted();
  if (!mounted) return <div />;

  return (
    <div className='my-20' id='testimonial'>
      <p className='mb-8 text-center font-magilio text-5xl capitalize downSm:text-3xl'>
        <Trans i18nKey='testimonial.title' />
      </p>
      {/* <Carousel
        showStatus={false}
        showArrows={false}
        preventMovementUntilSwipeScrollTolerance={true}
        swipeScrollTolerance={50}
      >
        <div className='flex items-center justify-center  downMd:flex-col upLg:space-x-6'>
          {[...Array(3)].map((_, index) => (
            <TestimonialCard
              key={index}
              img={t(`testimonial.${index}.img`)}
              stars={parseInt(t(`testimonial.${index}.stars`))}
              description={t(`testimonial.${index}.description`)}
              name={t(`testimonial.${index}.name`)}
            />
          ))}
        </div>
      </Carousel> */}
      <div className='flex items-center justify-center  downMd:flex-col upLg:space-x-6'>
        {[...Array(3)].map((_, index) => (
          <TestimonialCard
            key={index}
            img={t(`testimonial.${index}.img`)}
            stars={parseInt(t(`testimonial.${index}.stars`))}
            description={t(`testimonial.${index}.description`)}
            name={t(`testimonial.${index}.name`)}
          />
        ))}
      </div>
    </div>
  );
};
export { Testimonals };
