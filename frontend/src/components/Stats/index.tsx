import clsx from 'clsx';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { useFetch } from '@/hooks/useFetch';
import { useReduxState } from '@/hooks/useReduxState';

import { UserStatsDto } from '@/Dto/User/Stats.dto';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { Dialog } from '../Common/Dialog';
const StatsDialog = () => {
  const [daysSelectionIndex, setDaysSelectionIndex] = useState(0);

  const [{ user }, { update }] = useReduxState('user');
  const { data } = useFetch<UserStatsDto>(`user/${user?.id}/stats`);
  const showData =
    daysSelectionIndex === 0
      ? data?.app_using.last_7_days
      : data?.app_using.last_30_days;

  const showDataHour = showData?.map((item) => ({
    ...item,
    hour_spent: item.minute_spent / 60,
  }));
  const { t } = useTranslation('common');

  const nbrMinutes = showData?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.minute_spent;
  }, 0);

  const hours = (nbrMinutes || 0) / 60;
  const enjoyedHour = Math.floor(hours);
  const minutes = (hours - enjoyedHour) * 60;
  const enjoyedMinute = Math.round(minutes);
  const enjoyedTime =
    enjoyedHour >= 1
      ? `${enjoyedHour} hrs ${enjoyedMinute > 1 ? enjoyedMinute + ' min' : ''}`
      : enjoyedMinute + ' min';

  return (
    <Dialog
      handleClose={() => update(['currentMenuIndex'], MenuItemsIndex.NONE)}
      title={t('statistic.title').toString()}
    >
      <div className='flex h-[500px] flex-col items-center justify-center upLg:w-[700px] '>
        <div className='mb-6 flex w-[350px]  space-x-2 rounded-lg border-2  border-primary-light p-2 xs:w-[300px]'>
          <button
            onClick={() => setDaysSelectionIndex(0)}
            className={clsx([
              'flex flex-1 justify-center rounded-lg p-2  capitalize duration-300',
              daysSelectionIndex === 0 && 'bg-bgSelected',
            ])}
          >
            <Trans i18nKey='statistic.last_7_days' />
          </button>
          <button
            onClick={() => setDaysSelectionIndex(1)}
            className={clsx([
              'flex flex-1 justify-center rounded-lg p-2 capitalize duration-300',
              daysSelectionIndex === 1 && 'bg-bgSelected',
            ])}
          >
            <Trans i18nKey='statistic.last_30_days' />
          </button>
        </div>
        <p className='mb-4 text-gray-500 downSm:text-xs'>
          <Trans
            i18nKey={t('statistic.description')}
            values={{
              day: daysSelectionIndex === 0 ? 7 : 30,
              time: enjoyedTime,
            }}
          />
        </p>
        <ResponsiveContainer width='100%' height='70%'>
          <BarChart
            width={500}
            height={300}
            data={showDataHour}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='day' />
            {enjoyedHour > 0 ? (
              <YAxis dataKey='hour_spent' unit=' hour' />
            ) : (
              <YAxis dataKey='minute_spent' unit=' min' />
            )}

            <Bar dataKey='hour_spent' fill='#FB923C' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Dialog>
  );
};
export { StatsDialog };
