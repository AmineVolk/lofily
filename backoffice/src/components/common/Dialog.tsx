import clsx from 'clsx';
import { useEffect } from 'react';
import * as React from 'react';
import { useClickOutside } from 'react-click-outside-hook';
import { Trans } from 'react-i18next';

import { GradientButton } from './GradientButton';

type Props = {
  title?: string;
  children: JSX.Element;
  withHeader?: boolean;
  onValidate?: () => void;
  withValidationButton?: boolean;
  withContent?: boolean;
  onClose: () => void;
};

const Dialog = ({
  onClose,
  title,
  withHeader = true,
  children,
  onValidate,
  withValidationButton = true,
  withContent = true,
}: Props) => {
  const [ref, hasClickedOutside] = useClickOutside();

  useEffect(() => {
    if (hasClickedOutside) onClose();
  }, [hasClickedOutside]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-dialogBg outline-none focus:outline-none'>
      <div className='relative my-6 mx-auto w-auto max-w-3xl' ref={ref}>
        <div className='relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none'>
          {withHeader && (
            <div className='flex flex-1 border-b border-b-gray-200 p-5 font-semibold'>
              {title && (
                <div className='flex'>
                  <p className='text-gray-600'>{title}</p>
                </div>
              )}
              <div className='flex flex-1 justify-end'>
                <button
                  className='ml-4 items-center border-0 bg-transparent text-black'
                  onClick={() => onClose()}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='gray'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {withContent && (
            <div className='relative flex-auto p-6'>{children}</div>
          )}

          {withValidationButton && (
            <div
              className={clsx([
                'mt-4 flex justify-end space-x-4 p-4',
                withContent && 'border-t border-t-gray-200',
              ])}
            >
              <button
                className='rounded-md border border-gray-300 py-2 px-4 font-bold text-gray-600'
                onClick={() => onClose()}
              >
                <Trans i18nKey='cancel' />
              </button>
              {onValidate && (
                <GradientButton onClick={onValidate}>
                  <Trans i18nKey='confirm' />
                </GradientButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export { Dialog };
