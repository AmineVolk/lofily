import { useState } from 'react';

import { useReduxActions } from '@/hooks/useReduxState';

import { GetCategoryDto } from '@/Dto/CategoryBackground/GetCategory.dto';
import { MenuItemsIndex } from '@/services/redux-state/Store';

import { BackgroundsList } from './Backgrounds/BackgroundsList';
import { CategoriesList } from './Categories/CategoriesList';
import { Dialog } from '../Common/Dialog';

const ScenesDialog = () => {
  const { update } = useReduxActions();

  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryDto | null>(null);

  const onClose = () => update(['currentMenuIndex'], MenuItemsIndex.NONE);

  const onCategorySelected = (category: GetCategoryDto) => () => {
    setSelectedCategory(category);
  };

  const onBack = () => setSelectedCategory(null);

  return (
    <Dialog handleClose={onClose} withHeader={false}>
      <div className=' overflow-y-hidden upLg:min-w-[670px]'>
        {selectedCategory ? (
          <BackgroundsList
            onClose={onClose}
            onBack={onBack}
            selectedCategory={selectedCategory}
          />
        ) : (
          <CategoriesList
            onClose={onClose}
            onCategorySelected={onCategorySelected}
          />
        )}
      </div>
    </Dialog>
  );
};
export { ScenesDialog };
