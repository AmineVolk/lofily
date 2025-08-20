import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';

import { UserStatsDto } from '@/Dto/Stats/UserStats.dto';

import { BackgroundStats } from './BackgroundStast';
import { CardStats } from './CardStats';
import { EffectStats } from './EffectStats';

const Dashboard = () => {
  const { data } = useFetch<UserStatsDto>('users/stats');
  const users_stats = data?.users_stats;
  const users_premimum_stats = data?.users_premimum_stats;
  const nbr_user_of_background = data?.nbr_user_of_background;
  const nbr_user_of_effect = data?.nbr_user_of_effect;

  const { t } = useTranslation('common');
  return (
    <div className='flex flex-1 flex-col'>
      {data && users_stats && users_premimum_stats && (
        <div className='flex downMd:flex-col  downMd:space-y-6 upLg:space-x-6'>
          <CardStats title={t('dashboard.user_stats_title')} {...users_stats} />
          <CardStats
            title={t('dashboard.user_premium_stats_title')}
            {...users_premimum_stats}
          />
        </div>
      )}
      {nbr_user_of_background && (
        <BackgroundStats data={nbr_user_of_background} />
      )}
      {nbr_user_of_effect && <EffectStats data={nbr_user_of_effect} />}
    </div>
  );
};
export { Dashboard };
