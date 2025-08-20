import { Trans } from 'react-i18next';

import { Dialog } from './Dialog';

const ConfirmDialog = ({
  title,
  handleClose,
  onValidate,
  description,
}: {
  title: string;
  description?: string;
  onValidate: () => void;
  handleClose: () => void;
}) => {
  return (
    <Dialog
      onValidate={onValidate}
      handleClose={handleClose}
      withHeader={false}
    >
      <div className='max-w-xl'>
        <h3>{title}</h3>
        <p className='my-2'>{description}</p>
        <div className='mt-4 flex justify-end space-x-4'>
          <button
            className='rounded-lg  border border-secondary-base px-4 py-2 font-bold uppercase'
            onClick={handleClose}
          >
            <Trans i18nKey='cancel' />
          </button>
          <button
            className='rounded-lg bg-secondary-base px-4 py-2 font-bold uppercase'
            onClick={onValidate}
          >
            <Trans i18nKey='confirm' />
          </button>
        </div>
      </div>
    </Dialog>
  );
};
export { ConfirmDialog };
