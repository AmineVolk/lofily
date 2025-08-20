import clsx from 'clsx';
import Link from 'next/link';

const GradientLink = ({
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
        'rounded-3xl bg-gradient-to-l from-secondary-gradient-from to-secondary-gradient-to p-2 px-12 text-center font-description text-lg font-bold capitalize text-white shadow-button',
        className,
      ])}
    >
      {text}
    </Link>
  );
};

export { GradientLink };
