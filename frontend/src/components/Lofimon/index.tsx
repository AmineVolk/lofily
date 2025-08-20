import { useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { MenuItemsIndex } from '@/services/redux-state/Store';

import { StarterDetails } from './StarterDetails';
import { StarterSelection } from './StarterSelection';
import { Dialog } from '../Common/Dialog';

const LofimonDialog = () => {
  const { t } = useTranslation('common');
  const [{ user }, { update }] = useReduxState('user');

  const onClose = () => update(['currentMenuIndex'], MenuItemsIndex.NONE);

  const handleSelectStarter = (value: number) => {
    update(['user', 'starter_index'], value);
  };
  return (
    <Dialog handleClose={onClose}>
      {user?.starter_index != null ? <StarterDetails /> : <StarterSelection />}
    </Dialog>
  );
};
export { LofimonDialog };
