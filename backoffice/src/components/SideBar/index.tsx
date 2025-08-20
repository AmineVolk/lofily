import Image from 'next/image';
import { Trans, useTranslation } from 'react-i18next';

import useMediaQuery from '@/hooks/useMediaQuery';
import { useReduxState } from '@/hooks/useReduxState';

import { MenuItem } from './MenuItem';
import SideBarMobile from './mobile';

const SideBar = () => {
  const { t } = useTranslation('common');
  const [{ currentMenuItem }, { update }] = useReduxState('currentMenuItem');
  const isMedium = useMediaQuery(`(max-width:786px)`);

  const Items = () => (
    <div className='flex flex-col space-y-4 upMd:mt-10'>
      <MenuItem
        text={t('menu.dashboard')}
        iconSelected='/images/menu/dashboard-selected.svg'
        icon='/images/menu/dashboard.svg'
        selected={currentMenuItem === 0}
        onClick={() => update(['currentMenuItem'], 0)}
      />
      <MenuItem
        text={t('menu.users')}
        iconSelected='/images/menu/users-selected.svg'
        icon='/images/menu/users.svg'
        selected={currentMenuItem === 1}
        onClick={() => update(['currentMenuItem'], 1)}
      />
      <MenuItem
        text={t('menu.category')}
        icon='/images/menu/category.svg'
        iconSelected='/images/menu/category-selected.svg'
        selected={currentMenuItem === 2}
        onClick={() => update(['currentMenuItem'], 2)}
      />
      <MenuItem
        text={t('menu.background')}
        icon='/images/menu/bg.svg'
        iconSelected='/images/menu/bg-selected.svg'
        selected={currentMenuItem === 3}
        onClick={() => update(['currentMenuItem'], 3)}
      />
      <MenuItem
        text={t('menu.effects')}
        icon='/images/menu/effects.svg'
        iconSelected='/images/menu/effects-selected.svg'
        selected={currentMenuItem === 4}
        onClick={() => update(['currentMenuItem'], 4)}
      />
    </div>
  );
  if (isMedium)
    return (
      <SideBarMobile>
        <Items />
      </SideBarMobile>
    );
  return (
    <div className='flex flex-col border-r border-dashed p-4 upMd:min-w-[300px] '>
      <div className='flex items-center space-x-2'>
        <Image
          src='/images/logo.png'
          alt='lofily-logo'
          width={35}
          height={40}
        />
        <p className='font-bold'>
          <Trans i18nKey='app_name' />
        </p>
      </div>
      <Items />
    </div>
  );
};
export { SideBar };
