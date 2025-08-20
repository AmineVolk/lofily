import clsx from 'clsx';
import Image from 'next/image';

import { SortableList } from '@/components/Category/SortableList/SortableList';

import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { BgType } from '@/type';

const CategoryRow = ({
  item,
  onClickEditCategory,
  onClickDeleteCategory,
}: {
  item: GetCategoryDto;
  onClickEditCategory: (id: number) => void;
  onClickDeleteCategory: (id: number) => void;
}) => {
  const { id, thumbnail, nbr_backgrounds, is_for_premium, name, is_new } = item;
  return (
    <SortableList.Item id={id}>
      <div className='flex'>
        <div className='w-[15%]'>
          {thumbnail ? (
            <Image
              width={100}
              height={100}
              src={thumbnail}
              alt='cover'
              className='my-2 rounded-lg'
              loader={() => process.env.NEXT_PUBLIC_BACKEND_URL + thumbnail}
            />
          ) : (
            <Image
              width={100}
              height={100}
              src='/images/no-image.png'
              alt='cover'
              className='my-2 rounded-lg'
            />
          )}
        </div>
        <div className='flex w-[15%] items-center justify-center'>
          <p>{name}</p>
        </div>
        <div className='flex w-[15%]  items-center justify-center'>
          <p>{nbr_backgrounds}</p>
        </div>
        <div className='flex w-[15%]  items-center justify-center'>
          <p
            className={clsx([
              ' max-h-[40px] w-[80px] rounded-md p-2 text-center capitalize text-white',
              is_for_premium ? 'bg-[#FFAB00]' : 'bg-[#36B37E]',
            ])}
          >
            {is_for_premium ? BgType.PRIMUIM : BgType.FREE}
          </p>
        </div>

        <div className='flex w-[15%]  items-center justify-center'>
          <p className='max-w-[50px] text-center'>
            {is_new ? (
              <div className='rounded-md  border bg-secondary-base  p-2  text-white'>
                YES
              </div>
            ) : (
              <div className='rounded-md bg-gray-200  p-2'>NO</div>
            )}
          </p>
        </div>
        <div className='flex w-[15%]  items-center justify-center space-x-4'>
          <button onClick={() => onClickEditCategory(id)}>
            <Image width={20} height={20} src='/images/edit.svg' alt='edit' />
          </button>
          {nbr_backgrounds < 1 && (
            <button onClick={() => onClickDeleteCategory(id)}>
              <Image
                width={20}
                height={20}
                src='/images/delete.svg'
                alt='edit'
              />
            </button>
          )}
        </div>
        <div className='flex w-[15%] items-center justify-center'>
          <SortableList.DragHandle />
        </div>
      </div>
    </SortableList.Item>
  );
};
export { CategoryRow };
