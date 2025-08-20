import { GradientLink } from '../Common/GradientLink';
import { MenuItems } from './MenuItems';
import { useTranslation } from 'react-i18next';

const Desktop = () => {
  const { t } = useTranslation('common');

  return (
    <div className='flex min-h-[70px] items-center justify-end pt-8'>
      <MenuItems />
      <GradientLink
        href='https://app.lofily.com'
        text={t('navbar.go_to_app_button')}
      />
    </div>
  );
};

export default Desktop;
