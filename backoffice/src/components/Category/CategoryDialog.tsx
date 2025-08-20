import clsx from 'clsx';
import { ChangeEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { CreateCategoryDto } from '@/Dto/Category/CreateCategory.dto';
import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { logger } from '@/services/logger';
import { BgType } from '@/type';

import { Dialog } from '../common/Dialog';
import { Input } from '../common/Input';

const SaveCategoryDialog = ({
  onClose,
  onValidate,
  categoryToEdit,
}: {
  onClose: () => void;
  onValidate: (
    body: CreateCategoryDto | GetCategoryDto,
    onClose: () => void
  ) => () => void;
  categoryToEdit: GetCategoryDto | null;
}) => {
  const { t } = useTranslation('common');
  const title = categoryToEdit
    ? t('category.dialog.edit_title')
    : t('category.new');

  const [category, setCategory] = useState<CreateCategoryDto>(
    categoryToEdit || new CreateCategoryDto()
  );

  logger('category ', { category });

  const onChange =
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      logger('onChange ', { field, value });

      setCategory({
        ...category,
        [field]: field === 'is_for_premium' ? value === BgType.PRIMUIM : value,
      });
    };

  return (
    <Dialog
      onClose={onClose}
      title={title || ''}
      onValidate={onValidate(category, onClose)}
    >
      <div>
        <div className='min-w-[600px]'>
          <Input
            label={t('category.dialog.name_placeholder') || ''}
            value={category?.name}
            onChange={onChange('name')}
          />
        </div>

        <div className='mt-6'>
          <p className='text-gray-500'>
            <Trans i18nKey='category.dialog.type.title' />
          </p>
          <div className='mt-4 flex items-center space-x-4'>
            <div className='flex items-center'>
              <input
                id='type-free'
                type='radio'
                name='type-radio'
                value={BgType.FREE}
                className='h-4 w-4 accent-slate-700'
                checked={!category?.is_for_premium}
                onChange={onChange('is_for_premium')}
              />

              <label
                htmlFor='type-free'
                className='ml-2 text-sm font-medium text-gray-900 '
              >
                <Trans i18nKey='category.dialog.type.free' />
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='type-premium'
                type='radio'
                value={BgType.PRIMUIM}
                name='type-radio'
                className='h-4 w-4 accent-slate-700'
                checked={category?.is_for_premium}
                onChange={onChange('is_for_premium')}
              />
              <label
                htmlFor='type-premium'
                className='ml-2 text-sm font-medium text-gray-900 '
              >
                <Trans i18nKey='category.dialog.type.premium' />
              </label>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <p className='text-gray-500'>
            <Trans i18nKey='category.new' />
          </p>
          <div className='mt-2 mb-4 flex flex-1 space-x-2'>
            <button
              type='button'
              // @ts-expect-error no err
              onClick={() => onChange('is_new')({ target: { value: true } })}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                category.is_new && 'bg-secondary-base text-white',
              ])}
            >
              <Trans i18nKey='yes' />
            </button>
            <button
              type='button' // @ts-expect-error no err
              onClick={() => onChange('is_new')({ target: { value: false } })}
              className={clsx([
                'rounded-md  bg-gray-200 p-2 capitalize',
                !category.is_new && 'bg-secondary-base text-white',
              ])}
            >
              <Trans i18nKey='no' />
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export { SaveCategoryDialog };
