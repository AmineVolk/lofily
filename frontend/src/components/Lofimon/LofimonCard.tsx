import clsx from 'clsx';
import Image from 'next/image';

const LofimonCard = ({
  onClick,
  starterSelected,
  img,
  text,
}: {
  onClick?: () => void;
  starterSelected?: boolean;
  img: string;
  text?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx([
        ` relative flex flex-col  items-center justify-center rounded-2xl border border-secondary-base bg-primary-dark
        p-10 shadow-md shadow-secondary-base`,
        starterSelected && ' scale-110 transition duration-500',
      ])}
    >
      <Image alt='starter-image' src={img} width={100} height={200} />
      <div
        className={clsx([
          'absolute bottom-2 text-[16px] font-bold capitalize',
          starterSelected && 'text-[18px]',
        ])}
      >
        <p>{text}</p>
      </div>
    </button>
  );
};
export { LofimonCard };
