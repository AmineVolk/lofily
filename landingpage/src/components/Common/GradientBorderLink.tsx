import clsx from 'clsx';
import Link from 'next/link';

const GradientBorderLink = ({
  href,
  text,
  className,
}: {
  href: string;
  text: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      target='_blank'
      className={clsx([
        'flex w-full rounded-full bg-gradient-to-r from-secondary-gradient-from to-secondary-gradient-to p-[2px] hover:shadow-2xl',
      ])}
    >
      <div
        className={clsx([
          'flex flex-1 justify-center rounded-full bg-primary-light font-bold  capitalize text-white',
          className,
        ])}
      >
        <p className='text-center font-description text-lg'> {text}</p>
      </div>
    </Link>
  );
};

export { GradientBorderLink };
