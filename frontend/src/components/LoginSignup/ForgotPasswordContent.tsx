import Image from 'next/image';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AuthApi } from '@/services/api/Auth';

import { FormWrapper } from '../Common/FormWrapper';
import { GradientButton } from '../Common/GradientButton';
import { Input } from '../Common/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);

  const { t } = useTranslation('common');
  const hanldeSave = () => {
    setLoading(true);
    return AuthApi.forgotPassword({ email }).then(() => {
      setStatus(200);
      setLoading(false);
    });
  };
  const apiSuccess = status === 200;
  return (
    <FormWrapper onSubmit={hanldeSave} values={{ email }}>
      <div className='flex flex-1 flex-col items-center downMd:px-4 upLg:px-8'>
        <Image
          src='/images/logo-white.png'
          alt='lofily logo'
          width={48}
          height={48}
          className='mb-4'
        />
        <h2 className='mb-2 text-xl upMd:text-2xl'>
          <Trans i18nKey='forgot_password.title' />
        </h2>
        <p>
          <Trans i18nKey='forgot_password.description' />
        </p>
        <p className='mb-8'>
          <Trans i18nKey='forgot_password.description2' />
        </p>
        {apiSuccess ? (
          <div className='mb-6 rounded-md bg-green-500 p-2'>
            <Trans i18nKey='forgot_password.success' />
          </div>
        ) : (
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
        )}

        {!apiSuccess && (
          <GradientButton type='submit' loading={loading} className='mb-4'>
            <div className='flex items-center justify-center'>
              <Trans i18nKey='forgot_password.forgot_button' />
            </div>
          </GradientButton>
        )}
      </div>
    </FormWrapper>
  );
};
export { ForgotPassword };
