import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { Dialog } from '@/components/Common/Dialog';
import { ButtonLoader } from '@/components/Common/Loader';

import { SubscriptionInfos } from '@/Dto/User/UpdateUser.dto';
import { PaymentApi } from '@/services/api/Payments';
import { stringToDate } from '@/services/helper';
import { logger } from '@/services/logger';

const Membership = () => {
  const [confirmCancelDialog, setConfirmCancelDialog] = useState(false);
  const { t } = useTranslation('common');
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [{ user }, { update }] = useReduxState('user');
  const subscription_infos: SubscriptionInfos | undefined =
    user?.subscription_infos;
  logger('subscription_infos ', subscription_infos);

  const handleClickOnCancel = () => setConfirmCancelDialog(true);

  const handleCancelSubscription = () => {
    setConfirmCancelDialog(false);
    setloading(true);
    return PaymentApi.cancleSubscription()
      .then(({ data }) => {
        logger('updatedUser after cancel subscription ', data);
        setloading(false);
        setSuccess(true);
        setTimeout(() => document.location.reload(), 500);
      })
      .catch(() => setError(true));
  };

  if (!subscription_infos?.subscription_id) return <div />;
  return (
    <div className='border-b-2 border-primary-light pb-6'>
      {confirmCancelDialog && (
        <Dialog
          handleClose={() => setConfirmCancelDialog(false)}
          withHeader={false}
        >
          <div>
            <h3 className=' font-bold'>
              <Trans i18nKey='setting.membership.confirm_cancel_dialog.title' />
            </h3>
            <div className='mt-4 flex '>
              <button
                className='mr-4 flex-1 rounded-md border border-secondary-base p-2 font-bold capitalize'
                onClick={() => setConfirmCancelDialog(false)}
              >
                <Trans i18nKey='cancel' />
              </button>
              <button
                className='flex-1 rounded-md     bg-secondary-base p-2 font-bold capitalize'
                onClick={handleCancelSubscription}
              >
                <Trans i18nKey='setting.change_password.confim' />
              </button>
            </div>
          </div>
        </Dialog>
      )}
      <h2>
        <Trans i18nKey='setting.membership.title' />
      </h2>
      {subscription_infos.cancel_requested ? (
        <div className='mt-4 rounded-lg border border-primary-light p-4 text-center font-semibold'>
          <Trans i18nKey='setting.membership.cancel_requested' />
          <span className='font-bold text-secondary-base'>
            {subscription_infos.subscription_end}
          </span>
        </div>
      ) : (
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-wrap items-center pt-4 downSm:flex-col downSm:items-start downSm:space-y-4'>
            <div className=' mr-4 rounded-md bg-primary-light p-4'>
              <div className='flex items-center'>
                <h3 className='downSm:text-sm'>
                  <Trans i18nKey='setting.membership.plan_title' />
                </h3>
                <h3 className='mx-2 text-lg'>
                  {subscription_infos.amout_after_coupon ||
                    subscription_infos.amount}{' '}
                  {subscription_infos.currency} /
                </h3>
                <span>
                  <Trans i18nKey={`pricing.${subscription_infos.interval}`} />
                </span>
              </div>
              <div className='mt-2 flex'>
                <p className='text-gray-400'>
                  {stringToDate(subscription_infos.subscription_start)} to{' '}
                  {stringToDate(subscription_infos.subscription_end)}
                </p>
              </div>
            </div>
            <div className='mr-4 flex space-x-4 rounded-md bg-primary-light p-5'>
              <div className='flex items-center  rounded-md bg-[#4C414E] p-3 font-bold'>
                <p>Visa</p>
              </div>
              <div>
                <p className='text-lg'>
                  <Trans
                    i18nKey='setting.membership.card_number'
                    values={{ last4degit: subscription_infos.card_last_4 }}
                  />
                </p>
                <p className='text-gray-400'>
                  <Trans
                    i18nKey='setting.membership.card_renew'
                    values={{ date: subscription_infos.card_exp }}
                  />
                </p>
              </div>
            </div>
            <button
              disabled={loading}
              onClick={handleClickOnCancel}
              className='mb-0 flex h-[45px] items-center rounded-md border border-primary-light px-4 py-2 text-secondary-base  '
            >
              <Trans i18nKey='cancel' /> {loading && <ButtonLoader />}
            </button>
          </div>
        </div>
      )}
      {subscription_infos.invoice_pdf && (
        <div className='mt-6'>
          <a
            href={subscription_infos.invoice_pdf}
            className='rounded-md border border-primary-light p-2 px-4 text-secondary-base'
            target='_blank'
          >
            <Trans i18nKey='setting.membership.download_invoice' />
          </a>
        </div>
      )}
      {error && (
        <div className='mt-6 rounded-md bg-red-800 p-4'>
          <Trans i18nKey='setting.membership.cancel_subscription_error' />{' '}
          {error}
        </div>
      )}
      {success && (
        <div className='mt-6 rounded-md bg-green-500 p-4'>
          <Trans i18nKey='setting.membership.cancel_subscription_success' />
        </div>
      )}
    </div>
  );
};
export { Membership };
