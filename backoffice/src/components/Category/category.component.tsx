import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxActions } from '@/hooks/useReduxState';

import { CategoryRow } from '@/components/Category/CategoryRow';
import { Header } from '@/components/Category/Header';
import { SortableList } from '@/components/Category/SortableList/SortableList';

import { CreateCategoryDto } from '@/Dto/Category/CreateCategory.dto';
import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { CategoryApi } from '@/services/api/Category';
import { logger } from '@/services/logger';

import { SaveCategoryDialog } from './CategoryDialog';
import { DeleteDialog } from '../common/DeleteDialog';
import { GradientButton } from '../common/GradientButton';

type CategoryComponentProps = {
  data: GetCategoryDto[];

  onValidateDelete: (
    id: number,
    onCloseDialog: () => void,
    index: number
  ) => () => void;

  saveCategory: (
    index: number | null
  ) => (
    body: CreateCategoryDto | GetCategoryDto,
    onCloseDialog: () => void
  ) => () => void;
};

const CategoryComponent = ({
  data,
  onValidateDelete,
  saveCategory,
}: CategoryComponentProps) => {
  const { t } = useTranslation('common');
  const { update } = useReduxActions();
  const [clickedCateogry, setClickedCateogry] = useState<GetCategoryDto | null>(
    null
  );

  const [showModal, setShowModal] = useState({
    delete: false,
    create: false,
    edit: false,
  });

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<
    number | null
  >(null);

  const closeDialog = () => {
    setShowModal({ create: false, edit: false, delete: false });
    setClickedCateogry(null);
    setCurrentCategoryIndex(null);
  };

  const onClickNewCategory = () => {
    setShowModal({
      ...showModal,
      create: true,
    });
  };

  const onClickEditCategory = (idToEdit: number) => {
    setShowModal({ ...showModal, edit: true });
    const index = data.findIndex(({ id }) => id === idToEdit);

    setCurrentCategoryIndex(index);
    setClickedCateogry(getCategoryByIndex(index));
  };

  const onClickDeleteCategory = (idToDelete: number) => {
    setShowModal({ ...showModal, delete: true });
    const index = data.findIndex(({ id }) => id === idToDelete);
    setCurrentCategoryIndex(index);
    setClickedCateogry(getCategoryByIndex(index));
  };

  const getCategoryByIndex = (
    clickedCateogryIndex: number
  ): GetCategoryDto | null => {
    const result =
      data.find((_, index) => index === clickedCateogryIndex) || null;
    return result;
  };

  const shouldDisplayDeleteDialog =
    clickedCateogry &&
    showModal.delete &&
    typeof currentCategoryIndex === 'number';

  logger('shouldDisplayDeleteDialog ', shouldDisplayDeleteDialog);
  const shouldDisplaySaveCategory = showModal.create || showModal.edit;

  const updateCategoryOrder = (newCategories: GetCategoryDto[]) => {
    update(['categories'], newCategories);
    const body = newCategories.map(({ id }, index) => ({
      id,
      order: index,
    }));
    return CategoryApi.updateOrder({ categories: body });
  };

  return (
    <div className='flex h-full flex-1 flex-col'>
      {shouldDisplayDeleteDialog && (
        <DeleteDialog
          title={t('category.confirm_delete_category')}
          onValidate={onValidateDelete(
            clickedCateogry.id,
            closeDialog,
            currentCategoryIndex
          )}
          onClose={closeDialog}
        />
      )}

      {shouldDisplaySaveCategory && (
        <SaveCategoryDialog
          onValidate={saveCategory(currentCategoryIndex)}
          onClose={closeDialog}
          categoryToEdit={clickedCateogry}
        />
      )}

      <div className='mb-12 flex'>
        <h3>
          <Trans i18nKey='category.title' />
        </h3>
        <div className='flex flex-1 justify-end'>
          <GradientButton onClick={onClickNewCategory}>
            <Trans i18nKey='category.new' />
          </GradientButton>
        </div>
      </div>
      <div className='overflow-y-auto'>
        <Header />
        <SortableList
          items={data}
          onChange={updateCategoryOrder}
          renderItem={(item) => (
            <CategoryRow
              item={item}
              onClickDeleteCategory={onClickDeleteCategory}
              onClickEditCategory={onClickEditCategory}
            />
          )}
        />
      </div>
    </div>
  );
};

export { CategoryComponent };
