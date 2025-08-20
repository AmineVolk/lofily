import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { CategoryComponent } from '@/components/Category/category.component';

import { CreateCategoryDto } from '@/Dto/Category/CreateCategory.dto';
import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { CategoryApi } from '@/services/api/Category';
import { logger } from '@/services/logger';
const CategoryContainer = () => {
  const [{ categories }, { update, append, remove }] =
    useReduxState('categories');

  logger('categories ', categories);

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation('common');

  const saveCategory =
    (index: number | null) =>
    (body: CreateCategoryDto | GetCategoryDto, closeDialog: () => void) => {
      logger('saveCategory ', { body, index });

      if (typeof index === 'number') {
        return onValidateEdit(body as GetCategoryDto, closeDialog, index);
      }
      return onValidateCreation(body as CreateCategoryDto, closeDialog);
    };

  const onValidateEdit =
    (
      editedCategory: GetCategoryDto,
      onCloseDialog: () => void,
      index: number
    ) =>
    () => {
      logger('-------- onValidate edit ', { editedCategory, index });
      CategoryApi.update(editedCategory).then(() => {
        update(['categories'], editedCategory, index);
        onCloseDialog();
      });
    };

  const onValidateCreation =
    (body: CreateCategoryDto, closeDialog: () => void) => () => {
      CategoryApi.create(body)
        .then(({ data }) => {
          append(['categories'], data);
          closeDialog();
        })
        .catch((status) => {
          if (status === 409) {
            enqueueSnackbar(t('category.already_exist'), { variant: 'error' });
          }
        });
    };

  const onValidateDelete =
    (id: number, closeDialog: () => void, index: number) => () => {
      return CategoryApi.remove(id).then(() => {
        remove(['categories', index.toString()]);
        closeDialog();
      });
    };

  return (
    <>
      <CategoryComponent
        data={categories}
        saveCategory={saveCategory}
        onValidateDelete={onValidateDelete}
      />
    </>
  );
};

export { CategoryContainer };
