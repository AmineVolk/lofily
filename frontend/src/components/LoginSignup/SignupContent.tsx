import Image from 'next/image';
import { Trans, useTranslation } from 'next-i18next';
import { useState } from 'react';

import { AuthApi } from '@/services/api/Auth';

import { FormWrapper } from '../Common/FormWrapper';
import { GradientButton } from '../Common/GradientButton';
import { Input } from '../Common/Input';

const SignupContent = ({ onClickLogin }: { onClickLogin: () => void }) => {
  const { t } = useTranslation('common');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<number>();
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    return AuthApi.register({
      username,
      email,
      password,
    })
      .then(() => setStatus(201))
      .catch((status) => {
        setStatus(status);
      })
      .finally(() => setLoading(false));
  };

  return (
    <FormWrapper onSubmit={handleSignup} values={{ username, email, password }}>
      <div className='flex flex-1 flex-col items-center justify-center text-white upMd:min-w-[400px] downMd:px-4 upLg:px-8'>
        <Image
          src='/images/logo-white.png'
          alt='lofily logo'
          width={48}
          height={48}
          className='mb-4'
        />
        <h2 className='mb-6 text-3xl'>
          <Trans i18nKey='signup.title' />
        </h2>
        {status === 409 && (
          <div className='mb-4 rounded-md bg-red-400 p-2 px-6 text-sm'>
            <Trans i18nKey='signup.already_exist' />
          </div>
        )}
        {status === 201 ? (
          <div className='text-bold mb-4 rounded-md bg-green-600 p-2 px-6 text-sm'>
            <Trans i18nKey='signup.success' />
          </div>
        ) : (
          <>
            <Input
              id='username'
              label='username'
              value={username}
              onChange={(value) => setUsername(value.toString())}
              validation={{
                required: t('username_required'),
              }}
            />
            <Input
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
            <p className='text-center text-xs text-[#69616a]'>
              <Trans i18nKey='signup.agree_title' />
            </p>
            <div
              className='mb-6 text-xs '
              dangerouslySetInnerHTML={{
                __html: t('signup.agree_link'),
              }}
            />
            <GradientButton type='submit' loading={loading}>
              <div className='flex items-center justify-center'>
                <Trans i18nKey='signup.button' />
              </div>
            </GradientButton>
            <div className='mt-6 flex w-full flex-1 justify-center'>
              <button className='' onClick={onClickLogin}>
                <p className='text-secondary-base'>
                  <Trans i18nKey='signup.login' />
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </FormWrapper>
  );
};

export { SignupContent };
