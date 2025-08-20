import { AxiosResponse } from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { GradientButton } from '@/components/Common/GradientButton';

import { GetCategoryDto } from '@/Dto/CategoryBackground/GetCategory.dto';
import { GetCategoryWithBackgroundsDto } from '@/Dto/CategoryBackground/GetCategoryWithBackgrounds.dto';
import { GetBackgroundDto } from '@/Dto/GetBackground.dto';
import { CategoryApi } from '@/services/api/Category';
import { UserApi } from '@/services/api/UserApi';
import { isUserPremium } from '@/services/premium_helper';

import { BackgroundCard } from './BackgroundCard';

const BackgroundsList = ({
  onBack,
  onClose,
  selectedCategory,
}: {
  onBack: () => void;
  onClose: () => void;
  selectedCategory: GetCategoryDto;
}) => {
  const [{ user }, { update }] = useReduxState('user');
  const [backgrounds, setBackgrounds] = useState<GetBackgroundDto[]>([]);

  useEffect(() => {
    CategoryApi.getAllCategoriesBackgrounds(selectedCategory.id).then(
      (data: AxiosResponse<GetCategoryWithBackgroundsDto[], any>) => {
        setBackgrounds(data.data[0].backgrounds);
      }
    );
  }, [selectedCategory.id]);

  const hanldeSelectBackground = (id: number) => () => {
    const selectedBackground = backgrounds.find((bg) => bg.id === id);
    if (canUserChangeScenes() && selectedBackground) {
      if (!user) {
        update(['freeBackgroundUrl'], selectedBackground?.url);
        update(['freeBackgroundUrlMobile'], selectedBackground?.url_mobile);
      } else {
        return UserApi.update(user.id, {
          background_id: selectedBackground?.id,
        }).then(() => {
          update(['user'], {
            ...user,
            background_id: selectedBackground?.id,
            background_url: selectedBackground?.url,
            background_url_mobile: selectedBackground?.url_mobile,
          });
        });
      }
    }
  };

  const canUserChangeScenes = () =>
    isUserPremium(user) || !selectedCategory.is_for_premium;

  const handleClickSubscribe = () => {
    onClose();
    update(['displayPricingDialog'], true);
  };

  return (
    <div>
      <div className='mb-6 flex items-center space-x-3'>
        <button onClick={onBack}>
          <Image
            src='/images/notes/back.svg'
            width={36}
            height={36}
            alt='back'
          />
        </button>
        <p className='text-[16px] font-semibold capitalize'>
          {selectedCategory.name}
        </p>
        <div className='flex items-center space-x-1'>
          <Image
            src='/images/backgrounds.svg'
            alt='backgrounds'
            width={24}
            height={24}
            className='mb-0'
          />
          <p>{selectedCategory.nbr_backgrounds}</p>
        </div>
        {selectedCategory.is_for_premium && (
          <Image
            src='/images/premium.svg'
            width={20}
            height={20}
            alt='premium'
          />
        )}
        <div className='flex flex-1 justify-end space-x-3'>
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

      {selectedCategory.is_for_premium && !isUserPremium(user) && (
        <div className='mb-4 rounded-md border border-primary-light p-4 text-gray-300'>
          <Trans i18nKey='premium_description.background.description' />
          <GradientButton
            className='mt-2 justify-center py-2'
            onClick={handleClickSubscribe}
          >
            <>
              <Image
                src='/images/premium-white.svg'
                alt='premium'
                className='mr-2'
                width={20}
                height={20}
              />
              <p className='font-semibold'>
                <Trans i18nKey='payment.subscribe' />
              </p>
            </>
          </GradientButton>
        </div>
      )}

      <div className='flex flex-wrap downSm:flex-col downSm:items-center upMd:max-w-5xl'>
        {backgrounds.map(({ id, thumbnail, thumbnail_mobile }) => (
          <BackgroundCard
            key={id}
            thumbnail={thumbnail}
            thumbnail_mobile={thumbnail_mobile}
            hanldeSelectBackground={hanldeSelectBackground(id)}
            selected={id === user?.background_id}
          />
        ))}
      </div>
    </div>
  );
};
export { BackgroundsList };
