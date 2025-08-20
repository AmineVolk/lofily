import { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Trans, useTranslation } from 'react-i18next';

import { useIsMounted } from '@/hooks/useIsMounted';

import { ContactApi } from '@/service/api/ContactApi';

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
      console.log('--- Execute recaptcha not yet available ---');
      return;
    }

    const token = await executeRecaptcha();
    console.log('---token ---', token);

    setLoading(true);
    return ContactApi.sendContact({
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
        className='contact flex flex-col rounded-xl border-[3px] border-primary-light p-16 font-description downSm:w-full downSm:p-4 downSm:py-8 upLg:w-[700px]'
        id='contact'
      >
        {mounted && (
          <>
            <div className='mb-8 flex flex-col space-y-4'>
              <p className='text-center font-magilio text-xl text-gray-400'>
                <Trans i18nKey='contact.title' />
              </p>

              {status === 200 && (
                <p className='rounded-lg bg-green-700 p-4 text-center'>
                  <Trans i18nKey='contact.success' />
                </p>
              )}
            </div>
            <Input
              id='name'
              label='name'
              value={name}
              onChange={(value) => setName(value)}
              validation={{
                required: t('contact.name_required').toString(),
              }}
            />
            <Input
              id='email'
              label='email'
              value={email}
              onChange={(value) => setEmail(value)}
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
              onChange={(value) => setSubject(value)}
              validation={{
                required: t('contact.subject_required').toString(),
              }}
            />
            <Input
              id='message'
              label='message'
              value={message}
              onChange={(value) => setMessage(value)}
              validation={{
                required: t('contact.message_required').toString(),
              }}
              isTextarea
            />
            <button
              className='flex items-center justify-center rounded-lg border border-primary-light bg-transparent py-2 text-secondary-base'
              type='submit'
              disabled={loading}
            >
              {loading && <ButtonLoader />}
              <p className='ml-2'>
                <Trans i18nKey='contact.send' />
              </p>
            </button>
          </>
        )}
      </div>
    </FormWrapper>
  );
};
export { Contact };
