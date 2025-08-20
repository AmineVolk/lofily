import clsx from 'clsx';
import Image from 'next/image';

const MenuItem = ({
  text,
  icon,
  iconSelected,
  selected,
  onClick,
}: {
  text: string;
  icon: string;
  selected?: boolean;
  iconSelected: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx([
        'flex space-x-4  rounded-xl bg-gradient-to-br p-4 downSm:mx-4',
        selected &&
          'from-secondary-gradient-from to-secondary-gradient-to text-white',
      ])}
    >
      <Image
        src={selected ? iconSelected : icon}
        alt='icon'
        width={20}
        height={20}
      />
      <span>{text}</span>
    </button>
  );
};

export { MenuItem };
