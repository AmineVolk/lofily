import clsx from 'clsx';
import Image from 'next/image';

import { useIsMounted } from '@/hooks/useIsMounted';

const ImageDescription = ({
  image,
  imageLeft,
  title,
  description,
}: {
  image: string;
  imageLeft: boolean;
  title: string;
  description: string;
}) => {
  const [mounted] = useIsMounted();
  return (
    <div
      key={title}
      className={clsx([
        '  relative flex flex-wrap downLg:flex-col',
        !imageLeft && 'flex-row-reverse',
      ])}
    >
      <div
        className={clsx([
          'relative flex flex-1  justify-center',
          imageLeft ? 'upMd:mr-14' : 'mpMd:ml-14',
        ])}
        data-sal={imageLeft ? 'slide-right' : 'slide-left'}
        data-sal-easing='ease-in'
        data-sal-duration='1200'
      >
        <Image src={image} alt='features image' height={700} width={550} />
      </div>
      <div
        className={clsx([
          'flex  flex-1 items-center  downLg:mt-20 downLg:justify-center',
          imageLeft ? 'upXl:justify-start' : 'upXl:justify-end',
        ])}
      >
        <div
          className='max-w-[500px]'
          data-sal='fade'
          data-sal-easing='ease-in'
          data-sal-duration='1200'
          data-sal-delay='500'
        >
          {mounted && (
            <h1 className='mb-6 font-magilio text-[50px] capitalize leading-tight downMd:text-[30px]'>
              {title}
            </h1>
          )}
          {mounted && (
            <p className='font-description   text-2xl text-gray-500'>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export { ImageDescription };
