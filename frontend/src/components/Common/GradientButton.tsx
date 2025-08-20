import clsx from 'clsx';

import { ButtonLoader } from './Loader';

const GradientButton = ({
  children,
  onClick,
  className,
  type,
  loading,
  disabled,
}: {
  onClick?: () => void;
  children: JSX.Element;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  loading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx([
        'flex rounded-md bg-gradient-to-br from-secondary-gradient-from to-secondary-gradient-to p-2 px-4 font-bold text-white',
        className,
      ])}
      type={type}
    >
      {children}
      {loading && <ButtonLoader />}
    </button>
  );
};

export { GradientButton };
