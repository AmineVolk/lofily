import Image from 'next/image';
import Router from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { useState } from 'react';

import { AuthApi } from '@/services/api/Auth';
import { UserApi } from '@/services/api/UserApi';

import { FormWrapper } from '../Common/FormWrapper';
import { GradientButton } from '../Common/GradientButton';
import { Input } from '../Common/Input';

const LoginContent = ({
  setClickedSignup,
  setClickedForgot,
}: {
  setClickedSignup: () => void;
  setClickedForgot: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<number>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');

  const submitLogin = () => {
    setLoading(true);
    return AuthApi.login({
      email,
      password,
    })
      .then(() => {
        UserApi.me();
        Router.reload();
      })
      .catch((status) => setStatus(status))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FormWrapper onSubmit={submitLogin} values={{ email, password }}>
      <div className='flex flex-1 flex-col items-center justify-center text-white upMd:min-w-[400px] downMd:px-4 upLg:px-8'>
        <Image
          src='/images/logo-white.png'
          alt='lofily logo'
          width={48}
          height={48}
          className='mb-4'
        />
        <h2 className='downMd:text-md mb-2 upLg:text-[32px]'>
          <Trans i18nKey='login.title' />
        </h2>
        {status === 401 && (
          <div className='my-4 rounded-md bg-red-400 p-2 px-6 text-sm'>
            <Trans i18nKey='login.failed' />
          </div>
        )}
        <p className='mb-4 text-xs'>
          <Trans i18nKey='login.sub_title' />
        </p>
        <Input
          type='string'
          id='email'
          label='email'
          value={email}
          onChange={(value) => setEmail(value.toString())}
          validation={{
            required: t('email_required').toString(),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('email_invalid').toString(),
            },
          }}
        />
        <Input
          id='password'
          label='password'
          value={password}
          type='password'
          onChange={(value) => setPassword(value.toString())}
          validation={{
            required: t('password_required').toString(),
          }}
        />
        <GradientButton type='submit' className='my-4 px-10' loading={loading}>
          <Trans i18nKey='login.button' />
        </GradientButton>
        <div className='flex w-full flex-1'>
          <button
            className=' text-secondary-base'
            type='button'
            onClick={setClickedForgot}
          >
            <Trans i18nKey='login.forgot_password' />
          </button>

          <button
            className='flex flex-1 justify-end'
            onClick={setClickedSignup}
          >
            <p className='text-secondary-base'>
              <Trans i18nKey='login.signup' />
            </p>
          </button>
        </div>
      </div>
    </FormWrapper>
  );
};
export { LoginContent };
