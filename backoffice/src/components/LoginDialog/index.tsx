import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { AuthApi } from '@/services/api/Auth';

import { Card } from '../common/Card';
import { FormWrapper } from '../common/FormWrapper';
import { InputForm } from '../common/InputForm';
import { ButtonLoader } from '../common/Loader';

const LoginDialog = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginFailed, setIsLoginFaileds] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const submitLogin = () => {
    setLoading(true);
    return AuthApi.login({ email, password })
      .then((res) => {
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('refresh_token', res.data.refresh_token);

        enqueueSnackbar(t('login.success'), { variant: 'success' });
        window.location.href = '/';
      })
      .catch(() => setIsLoginFaileds(true))
      .finally(() => setLoading(false));
  };

  return (
    <Card className='shadow-2xl'>
      <FormWrapper onSubmit={submitLogin} values={{ email, password }}>
        <div className='flex flex-col p-10'>
          <p className=' mb-4 text-2xl  font-bold'>
            <Trans i18nKey='login.title' />
          </p>
          {isLoginFailed && (
            <p className='text-bold hvr-icon-buzz-out mb-4 rounded-md bg-red-400 p-2 text-white'>
              <Trans i18nKey='login.login_failed' />
            </p>
          )}
          <InputForm
            id='email'
            label='email'
            value={email}
            onChange={(value) => setEmail(value.toString())}
            validation={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
            }}
          />
          <InputForm
            id='password'
            label='password'
            value={password}
            type='password'
            onChange={(value) => setPassword(value.toString())}
            validation={{
              required: 'Password is required',
            }}
          />
          <button
            className='flex justify-center rounded-xl bg-gradient-to-br from-secondary-gradient-from to-secondary-gradient-to p-4 font-bold text-white'
            type='submit'
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : <Trans i18nKey='login.button' />}
          </button>
        </div>
      </FormWrapper>
    </Card>
  );
};

export { LoginDialog };
