import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AuthApi } from '@/services/api/Auth';

import { FormWrapper } from '../Common/FormWrapper';
import { GradientButton } from '../Common/GradientButton';
import { Input } from '../Common/Input';

const ResetPasswordContent = ({
  onClickLogin,
}: {
  onClickLogin: () => void;
}) => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const apiSuccess = status === 200;

  const { t } = useTranslation('common');
  const hanldeSave = () => {
    if (router.query.reset_token) {
      setLoading(true);
      return AuthApi.resetPassword({
        newPassword: password,
        token: router.query.reset_token.toString(),
      }).then(() => {
        setLoading(false);
        setStatus(200);
        // used to delete the token from the url
        history.pushState({}, '', '/');
        setTimeout(() => onClickLogin(), 2000);
      });
    }
  };

  const isSamePassword = password === confirmPassword;
  return (
    <FormWrapper onSubmit={hanldeSave} values={{ password, confirmPassword }}>
      <div className='mx-10 flex flex-col items-center'>
        <Image
          src='/images/logo-white.png'
          alt='lofily logo'
          width={48}
          height={48}
          className='mb-4'
        />
        <h2 className='mb-8 text-3xl'>
          <Trans i18nKey='reset_password.title' />
        </h2>
        {apiSuccess ? (
          <div className='mb-6 rounded-md bg-green-500 p-2'>
            <Trans i18nKey='reset_password.success' />
          </div>
        ) : (
          <>
            <Input
              id='password'
              label='password'
              type='password'
              value={password}
              onChange={(value) => setPassword(value.toString())}
              validation={{
                required: t('reset_password.password_required').toString(),
              }}
            />
            <Input
              id='confirm_password'
              label='confirm your password'
              type='password'
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(value.toString())}
              validation={{
                required: t(
                  'reset_password.confirm_password_required'
                ).toString(),
              }}
            />
          </>
        )}

        {!isSamePassword && (
          <div className='mb-8 max-w-[310px] rounded-md bg-red-500 p-2'>
            <p>
              <Trans i18nKey='reset_password.confirm_password_error' />
            </p>
          </div>
        )}
        {!apiSuccess && (
          <GradientButton
            type='submit'
            loading={loading}
            className='mb-4'
            disabled={!isSamePassword}
          >
            <div className='flex items-center justify-center'>
              <Trans i18nKey='reset_password.reset_button' />
            </div>
          </GradientButton>
        )}
      </div>
    </FormWrapper>
  );
};
export { ResetPasswordContent };
