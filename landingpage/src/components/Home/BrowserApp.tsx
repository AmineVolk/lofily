import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import useMediaQuery from '@/hooks/useMediaQuery';
// const images = [
//   '/images/screenshots/1.png',
//   '/images/screenshots/2.png',
//   '/images/screenshots/3.png',
//   '/images/screenshots/4.png',
// ];
// const imagesMobile = [
//   '/images/screenshots/mobile/1.png',
//   '/images/screenshots/mobile/2.png',
//   '/images/screenshots/mobile/3.png',
//   '/images/screenshots/mobile/4.png',
// ];
const NBR_IMAGES = 4;
const BrowserApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 390px)');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === NBR_IMAGES) {
        setCurrentIndex(1);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  console.log('--------- currentIndex ', currentIndex);
  return (
    <div className='flex flex-1 justify-center'>
      <div
        className='relative mt-10 flex max-w-[1300px]
      flex-1
      justify-center
      sm:min-h-[300px]
      md:min-h-[500px]
      xs:min-h-[200px]
      upLg:min-h-[912px]
      '
        ref={ref}
      >
        {[1, 2, 3, 4].map((value) => (
          <Image
            src={
              isMobile
                ? `'/images/screenshots/mobile/${value}.png'`
                : `/images/screenshots/${value}.png`
            }
            key={value}
            alt={'screenshot-' + value}
            fill
            className={clsx([
              'object-contain transition-opacity duration-[1.2s]',
              value === currentIndex ? 'opacity-100 ' : 'opacity-0',
            ])}
          />
        ))}
      </div>
    </div>
  );
};
export { BrowserApp };
