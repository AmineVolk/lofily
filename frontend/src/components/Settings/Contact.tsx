import { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Trans, useTranslation } from 'react-i18next';

import { useIsMounted } from '@/hooks/useIsMounted';

import { UserApi } from '@/services/api/UserApi';

import { FormWrapper } from '../Common/FormWrapper';
import { Input } from '../Common/Input';
import { ButtonLoader } from '../Common/Loader';

const Contact = () => {
  const [mounted] = useIsMounted();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState<number>();

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('common');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const submitLogin = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha();

    setLoading(true);
    return UserApi.sendContact({
      name,
      email,
      subject,
      message,
      recaptcha_token: token,
    }).then(() => {
      setLoading(false);
      setStatus(200);
    });
  }, [executeRecaptcha, name, email, subject, message]);

  return (
    <FormWrapper
      onSubmit={submitLogin}
      values={{ name, email, subject, message }}
    >
      <div
        className='  w-full  justify-start rounded-xl px-16 downSm:p-4 downSm:py-8 '
        id='contact'
      >
        <h2 className='mb-4 text-center'>
          <Trans i18nKey='setting.contact.title' />
        </h2>
        <p className='mb-4 text-center text-gray-400'>
          <Trans i18nKey='setting.contact.sub_title' />
        </p>
        {mounted && (
          <>
            {status === 200 && (
              <div className='mb-8 flex flex-col space-y-4'>
                <p className='rounded-lg bg-green-700 p-4 text-center'>
                  <Trans i18nKey='contact.success' />
                </p>{' '}
              </div>
            )}
            <Input
              id='name'
              label='name'
              value={name}
              onChange={(value) => setName(value.toString())}
              validation={{
                required: t('contact.name_required').toString(),
              }}
            />
            <Input
              id='email'
              label='email'
              value={email}
              onChange={(value) => setEmail(value.toString())}
              validation={{
                required: t('contact.email_required').toString(),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('contact.email_invalid').toString(),
                },
              }}
            />
            <Input
              id='subject'
              label='subject'
              value={subject}
              onChange={(value) => setSubject(value.toString())}
              validation={{
                required: t('contact.subject_required').toString(),
              }}
            />
            <Input
              id='message'
              label='message'
              value={message}
              onChange={(value) => setMessage(value.toString())}
              validation={{
                required: t('contact.message_required').toString(),
              }}
              isTextarea
            />
            <button
              className='mb-4 w-full items-center justify-center rounded-lg border border-primary-light bg-transparent py-2 text-secondary-base'
              type='submit'
              disabled={loading}
            >
              {loading && <ButtonLoader />}
              <p className='ml-2'>
                <Trans i18nKey='setting.contact.send' />
              </p>
            </button>
          </>
        )}
      </div>
    </FormWrapper>
  );
};
export { Contact };
