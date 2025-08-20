import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { GetCategoryDto } from '@/Dto/CategoryBackground/GetCategory.dto';
import { CategoryApi } from '@/services/api/Category';

import { CategoryCard } from './CategoryCard';

const CategoriesList = ({
  onClose,
  onCategorySelected,
}: {
  onClose: () => void;
  onCategorySelected: (category: GetCategoryDto) => () => void;
}) => {
  const [categories, setCategories] = useState<GetCategoryDto[]>([]);

  useEffect(() => {
    CategoryApi.getAll().then(({ data }) => setCategories(data));
  }, []);

  return (
    <div className='relative flex flex-col'>
      <div className='mb-6 flex'>
        <p className='font-semibold capitalize'>
          <Trans i18nKey='backgrounds.title' />
        </p>
        <div className='flex flex-1 justify-end'>
          <button onClick={onClose}>
            <Image
              src='/images/notes/close.svg'
              width={24}
              height={24}
              alt='close'
            />
          </button>
        </div>
      </div>
      <div className='flex flex-wrap    downSm:flex-col downSm:items-center upMd:max-w-5xl'>
        {categories
          .filter((item) => item.thumbnail)
          .map((category) => (
            <CategoryCard
              onCategorySelected={onCategorySelected(category)}
              key={category.id}
              {...category}
            />
          ))}
      </div>
    </div>
  );
};
export { CategoriesList };
