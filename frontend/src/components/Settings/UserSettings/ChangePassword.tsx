import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ButtonLoader } from '@/components/Common/Loader';

import { UserApi } from '@/services/api/UserApi';

const ChangePassword = () => {
  const { t } = useTranslation('common');
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordAreDifferent, setPasswordAreDifferent] = useState(
    Boolean(
      newPassword.length &&
        confirmNewPassword.length &&
        newPassword !== confirmNewPassword
    )
  );
  const handleSave = () => {
    if (
      !newPassword.length ||
      !confirmNewPassword.length ||
      newPassword !== confirmNewPassword
    ) {
      setInvalidCurrentPassword(false);
      return setPasswordAreDifferent(true);
    }

    if (!currentPassword.length) {
      setPasswordAreDifferent(false);
      return setInvalidCurrentPassword(true);
    }

    setPasswordAreDifferent(false);
    setLoading(true);
    return UserApi.updatePassword({
      current_password: currentPassword,
      new_password: newPassword,
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setInvalidCurrentPassword(false);
      })
      .catch(() => {
        setInvalidCurrentPassword(true);
        setLoading(false);
      });
  };

  return (
    <div className='border-b-2 border-primary-light pb-6'>
      <h2 className='mb-4'>{t('setting.change_password.title')}</h2>
      <div className='flex downSm:flex-col downSm:space-y-4'>
        <input
          type='password'
          className='rounded-md bg-primary-light p-4 upMd:mr-4'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder={t('setting.change_password.current_password').toString()}
        />
        <input
          type='password'
          className='rounded-md bg-primary-light p-4 upMd:mr-4'
          value={newPassword}
          placeholder={t('setting.change_password.new_password').toString()}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type='password'
          className='rounded-md bg-primary-light p-4 upMd:mr-4'
          value={confirmNewPassword}
          placeholder={t('setting.change_password.confim').toString()}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </div>
      <button
        disabled={loading}
        onClick={handleSave}
        className='mt-4 flex h-[45px] items-center rounded-md border border-primary-light px-4 py-2 text-secondary-base'
      >
        <Trans i18nKey='save' /> {loading && <ButtonLoader />}
      </button>

      {success && (
        <div className='mt-6 rounded-md bg-green-500 p-4'>
          <Trans i18nKey='setting.change_password.success' />
        </div>
      )}

      {passwordAreDifferent && (
        <div className='mt-6 rounded-md bg-red-800 p-4'>
          <Trans i18nKey='setting.change_password.error' />
        </div>
      )}

      {invalidCurrentPassword && (
        <p className='mt-6 rounded-md bg-red-800 p-4'>
          <Trans i18nKey='setting.change_password.invalid_current_password' />
        </p>
      )}
    </div>
  );
};
export { ChangePassword };
