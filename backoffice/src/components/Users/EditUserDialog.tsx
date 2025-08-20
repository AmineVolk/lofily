import clsx from 'clsx';
import { Trans, useTranslation } from 'react-i18next';

import { GetUserDto } from '@/Dto/User/GetUserDto';
import { USER_TYPE } from '@/enum';

import { Dialog } from '../common/Dialog';
import { FormWrapper } from '../common/FormWrapper';
import { GradientButton } from '../common/GradientButton';
import { InputForm } from '../common/InputForm';

const EditUserDialog = ({
  onClose,
  onValidateEdit,
  handleUserChange,
  user,
}: {
  user: GetUserDto;
  onClose: () => void;
  onValidateEdit: () => void;
  handleUserChange: (filed: string, value: unknown) => void;
}) => {
  const { t } = useTranslation('common');

  const { email, username, isEmailConfirmed, type } = user;

  return (
    <Dialog
      title={t('users.edit_dialog.title').toString()}
      onClose={onClose}
      withValidationButton={false}
    >
      <FormWrapper
        onSubmit={onValidateEdit}
        values={{ email, username, isEmailConfirmed, type }}
      >
        <div className='min-w-[300px]'>
          <InputForm
            type='string'
            label='email'
            id='email'
            value={email}
            onChange={(value) => handleUserChange('email', value.toString())}
            validation={{
              required: t('users.edit_dialog.email_required').toString(),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('users.edit_dialog.email_invalid').toString(),
              },
            }}
          />
          <InputForm
            type='string'
            label='username'
            id='username'
            value={username}
            onChange={(value) => handleUserChange('username', value.toString())}
            validation={{
              required: t('users.edit_dialog.username_required').toString(),
            }}
          />
          <p className='text-gray-500'>
            <Trans i18nKey='users.edit_dialog.email_confirmed' />
          </p>
          <div className='mt-2 mb-6 flex flex-1 space-x-2'>
            <button
              type='button'
              onClick={() => handleUserChange('isEmailConfirmed', true)}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                isEmailConfirmed && 'bg-secondary-base text-white',
              ])}
            >
              YES
            </button>
            <button
              type='button'
              onClick={() => handleUserChange('isEmailConfirmed', false)}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                !isEmailConfirmed && 'bg-secondary-base text-white',
              ])}
            >
              NO
            </button>
          </div>
          <p className='text-gray-500'>
            <Trans i18nKey='users.edit_dialog.user_type' />
          </p>
          <div className='mt-2 mb-4 flex flex-1 space-x-2'>
            <button
              type='button'
              onClick={() => handleUserChange('type', USER_TYPE.PREMIUM)}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                type === USER_TYPE.PREMIUM && 'bg-secondary-base text-white',
              ])}
            >
              <Trans i18nKey='category.dialog.type.premium' />
            </button>
            <button
              type='button'
              onClick={() => handleUserChange('type', USER_TYPE.FREEMIUM)}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                type === USER_TYPE.FREEMIUM && 'bg-secondary-base text-white',
              ])}
            >
              <Trans i18nKey='category.dialog.type.free' />
            </button>
          </div>
          <div className='mt-4 flex justify-center space-x-4 border-t border-t-gray-200 pt-4'>
            <button
              className='rounded-md border border-gray-300 py-2 px-4 font-bold text-gray-600'
              onClick={() => onClose()}
            >
              <Trans i18nKey='cancel' />
            </button>
            <GradientButton type='submit'>
              <Trans i18nKey='confirm' />
            </GradientButton>
          </div>
        </div>
      </FormWrapper>
    </Dialog>
  );
};
export { EditUserDialog };
