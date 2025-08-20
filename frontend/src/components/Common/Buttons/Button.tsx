import React from 'react';

import clsxm from '@/services/clsxm';

import { ButtonLoader } from '../Loader';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  outlined?: boolean;
  primary?: boolean;
  active?: boolean;
  loading?: boolean;
  gradient?: boolean;
};
const Button = (props: Props) => {
  const {
    children,
    onClick,
    type = 'button',
    className = '',
    outlined,
    primary,
    active,
    loading,
    gradient,
  } = props;
  const outlinedStyle =
    outlined && 'rounded-md border border-gray-500 py-1 px-2';

  const primaryStyle =
    primary &&
    'bg-primary-700 text-white hover:bg-primary-800 hover:text-white py-1 px-4 rounded-md';

  const activeStyle = active && 'text-primary-700 font-bold';

  const loadingStyle = loading && 'bg-gray-400 hover:bg-gray-400';
  const gradientStyle =
    gradient &&
    'bg-gradient-to-r  bg-gradient-to-r from-primary-500 to-primary-800';
  return (
    <button
      className={clsxm(
        'hover:text-primary-800 flex  items-center text-text transition-colors duration-300',
        className,
        outlinedStyle,
        primaryStyle,
        activeStyle,
        loadingStyle,
        gradientStyle
      )}
      disabled={loading}
      onClick={onClick}
      type={type}
    >
      {!loading && children}
      {loading && <ButtonLoader />}
    </button>
  );
};

export { Button };
