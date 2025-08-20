import clsx from 'clsx';
import Image from 'next/image';

const LofimonButton = ({
  onClick,
  text,
  className,
}: {
  onClick: () => void;
  text: string;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx([
        'relative flex  h-[50px] w-[200px]   justify-center rounded-xl bg-gradient-to-br font-bold uppercase text-white',
        className,
      ])}
      type='submit'
    >
      <Image src='/images/lofimon/button.svg' fill alt='lofimon-button' />
      <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
        {text}
      </p>
    </button>
  );
};
export { LofimonButton };
