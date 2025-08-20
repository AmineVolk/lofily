import clsx from 'clsx';
import { useEffect } from 'react';
import * as React from 'react';
import { useClickOutside } from 'react-click-outside-hook';
import { Trans } from 'react-i18next';

import { Header } from './Header';
import { GradientButton } from '../GradientButton';

type Props = {
  title?: string;
  children: JSX.Element;
  withHeader?: boolean;
  onValidate?: () => void;
  withValidationButton?: boolean;
  withContent?: boolean;
  handleClose: () => void;
  className?: string;
};

const Dialog = ({
  handleClose,
  title,
  withHeader = true,
  children,
  onValidate,
  withValidationButton = false,
  withContent = true,
  className,
}: Props) => {
  const [ref, hasClickedOutside] = useClickOutside();

  useEffect(() => {
    if (hasClickedOutside) handleClose();
  }, [hasClickedOutside]);

  const ValidationButtons = () => (
    <div
      className={clsx([
        'mt-4 flex justify-end space-x-4 p-4',
        withContent && 'border-t border-t-gray-200',
      ])}
    >
      <button
        className='rounded-md border border-gray-300 py-2 px-4 font-bold text-gray-600'
        onClick={() => handleClose()}
      >
        <Trans i18nKey='cancel' />
      </button>
      <GradientButton onClick={onValidate}>
        <Trans i18nKey='confirm' />
      </GradientButton>
    </div>
  );

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-dialogBg px-4'>
      <div
        className={clsx([
          'relative flex  flex-col rounded-2xl border-0 bg-primary-dark shadow-lg  downSm:w-full',
          className,
        ])}
        ref={ref}
      >
        {withHeader && <Header title={title} handleClose={handleClose} />}
        {withContent && (
          <div
            className='h-full max-h-[80vh]  w-full overflow-y-auto overflow-x-hidden p-6'
            id='dialog-content'
          >
            {children}
          </div>
        )}
        {withValidationButton && <ValidationButtons />}
      </div>
    </div>
  );
};
export { Dialog };
