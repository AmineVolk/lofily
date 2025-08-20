import { Trans, useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
import { ChangeEvent } from 'react';

import { useReduxState } from '@/hooks/useReduxState';

import { CreateBackgroundDto } from '@/Dto/Background/CreateBackground.dto';
import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';
import { logger } from '@/services/logger';

import { UploadBackground } from './UploadBackground';
import { Dialog } from '../common/Dialog';
import { Select, SelecteItem } from '../common/Select';
import { Toggle } from '../common/Toggle';

type DialogProps = {
  onClose: () => void;
  currentBackground: GetBackgroundDto;
  onValidateEdit: (
    editedBackground: CreateBackgroundDto | GetBackgroundDto
  ) => () => void;
  deleteBackgroundMobile: () => void;
  isCategoryAlreadyHaveDefaultBackground: (
    background: CreateBackgroundDto
  ) => boolean;
  onChange: (
    field: string
  ) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  updateDesktopBackgroundState: (newBackground: GetBackgroundDto) => void;
  updateMobileVideoUrl: (url: string) => void;
};

const SaveBackgroundDialog = ({
  onClose,
  currentBackground,
  onValidateEdit,
  deleteBackgroundMobile,
  isCategoryAlreadyHaveDefaultBackground,
  onChange,
  updateDesktopBackgroundState,
  updateMobileVideoUrl,
}: DialogProps) => {
  logger('saveBackgroundDialog currentBackground ', currentBackground);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('common');
  const [{ categories }] = useReduxState('categories');

  const isEdit = currentBackground.id > 0;
  const title = isEdit ? t('background.dialog.edit') : t('background.new');

  const categoriesMapSelect: SelecteItem[] = categories.map(({ id, name }) => ({
    text: name,
    value: id,
  }));

  const noUploadError = () => {
    enqueueSnackbar(t('background.create_without_upload'), {
      variant: 'error',
    });
  };

  const onDesktopBackgroundUploaded = (serverReponse: string | null) => {
    if (!serverReponse) {
      return noUploadError();
    }

    const serverResponsejson = JSON.parse(serverReponse);

    updateDesktopBackgroundState(serverResponsejson);
  };

  const onMobileBackgroundUploaded = (serverReponse: string | null) => {
    if (!serverReponse) {
      return noUploadError();
    }
    const serverResponsejson = JSON.parse(serverReponse);

    updateMobileVideoUrl(serverResponsejson.url_mobile);
    onClose();
  };

  const selectedCategory = categories.find(
    (item) => item.id === currentBackground.category_id
  );

  const disbaleCategoryToggle =
    isCategoryAlreadyHaveDefaultBackground(currentBackground) &&
    !currentBackground.is_default;

  const CategorySelectSection = () => (
    <div>
      <Toggle
        checked={currentBackground.is_default}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        text={
          disbaleCategoryToggle ? (
            <Trans
              i18nKey='background.default_already_exist'
              values={{ name: selectedCategory?.name }}
            />
          ) : (
            t('background.is_default').toString()
          )
        }
        onChange={onChange('is_default')}
        disabled={disbaleCategoryToggle}
      />
      <div>
        <p className='mb-2 text-gray-600'>
          <Trans i18nKey='background.categories_select' />
        </p>
        <Select
          elements={categoriesMapSelect}
          onChange={onChange('category_id')}
          id='select-category'
          selected={currentBackground.category_id}
        />
      </div>
    </div>
  );
  const DesktopSection = () => {
    return (
      <>
        <p className='mb-2 font-bold text-gray-600'>
          <Trans i18nKey='background.upload_desktop_title' />
        </p>
        {currentBackground && currentBackground.url ? (
          <div>
            <video
              autoPlay
              muted
              loop
              className='h-[100px] max-w-[200px] rounded-lg'
            >
              <source
                src={
                  process.env.NEXT_PUBLIC_BACKEND_URL + currentBackground.url
                }
                type='video/mp4'
              />
            </video>
          </div>
        ) : (
          <UploadBackground
            description={t('background.drag_and_drop_description')}
            background={currentBackground}
            onUpload={onDesktopBackgroundUploaded}
          />
        )}
      </>
    );
  };
  const MobileSection = () => (
    <div className='border-t border-gray-200 pt-8'>
      <p className='mb-2 font-bold text-gray-600'>
        <Trans
          i18nKey={`background.upload_mobile_title${isEdit ? '_edit' : ''}`}
        />
      </p>
      <p className='mb-2 text-sm text-gray-500'>
        <Trans i18nKey='background.drag_and_drop_description_mobile_subtitle' />
      </p>
      {currentBackground.url_mobile ? (
        <>
          <video
            autoPlay
            muted
            loop
            className='h-[100px] max-w-[200px] rounded-lg'
          >
            <source
              src={
                process.env.NEXT_PUBLIC_BACKEND_URL +
                currentBackground.url_mobile
              }
              type='video/mp4'
            />
          </video>
          <div>
            <button
              className='mt-2 rounded-lg bg-red-800 py-2 px-4 capitalize text-white'
              onClick={deleteBackgroundMobile}
            >
              <Trans i18nKey='remove' />
            </button>
          </div>
        </>
      ) : (
        <UploadBackground
          description={t('background.drag_and_drop_description_mobile')}
          background={currentBackground}
          onUpload={onMobileBackgroundUploaded}
          background_id={currentBackground.id}
        />
      )}
    </div>
  );

  return (
    <Dialog
      title={title || ''}
      onClose={onClose}
      withValidationButton={isEdit}
      onValidate={onValidateEdit(currentBackground)}
    >
      <div className='flex min-w-[400px] flex-col space-y-8'>
        <CategorySelectSection />
        <DesktopSection />
        {isEdit && <MobileSection />}
      </div>
    </Dialog>
  );
};

export { SaveBackgroundDialog };
