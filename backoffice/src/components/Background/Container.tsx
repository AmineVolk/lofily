import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { CreateBackgroundDto } from '@/Dto/Background/CreateBackground.dto';
import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';
import { BackgroundApi } from '@/services/api/Background';

import { BackgroundList } from './BackgroundList';
import { SaveBackgroundDialog } from './SaveBackgroundDialog';
import { DeleteDialog } from '../common/DeleteDialog';

const BackgroundContainer = () => {
  const [
    {
      backgrounds: { data, total, page, limit },
      categories,
    },
    { update },
  ] = useReduxState('backgrounds,categories');

  const DEFAULT_BACKGROUND = {
    category_id: categories[0]?.id,
    is_default: false,
    url: '',
    id: 0,
    url_mobile: '',
  };

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState({
    delete: false,
    create: false,
    edit: false,
  });

  const [clickedBackground, setClickedBackground] =
    useState<GetBackgroundDto>(DEFAULT_BACKGROUND);

  const closeDialog = () => {
    setShowModal({ create: false, edit: false, delete: false });
    setClickedBackground(DEFAULT_BACKGROUND);
  };

  const onClickNew = () => {
    setShowModal({
      ...showModal,
      create: true,
    });
  };

  const onClickEdit = (id: number) => {
    setShowModal({ ...showModal, edit: true });
    setClickedBackground(getBackgroundById(id));
  };

  const onClickDelete = (id: number) => {
    setShowModal({ ...showModal, delete: true });
    setClickedBackground(getBackgroundById(id));
  };

  const getBackgroundById = (clickedBackgroundId: number): GetBackgroundDto =>
    data.find(({ id }) => id === clickedBackgroundId) || DEFAULT_BACKGROUND;

  const onValidateDelete = () => {
    if (clickedBackground) {
      return BackgroundApi.remove(clickedBackground?.id).then(() => {
        const newBackgrounds = data.filter(
          (background) => background.id !== clickedBackground?.id
        );
        update(['backgrounds', 'data'], newBackgrounds);
        setClickedBackground(DEFAULT_BACKGROUND);
        closeDialog();
      });
    }
  };

  const onValidateEdit =
    (editedBackground: CreateBackgroundDto | GetBackgroundDto) => () => {
      if (clickedBackground) {
        BackgroundApi.update(editedBackground).then(() => {
          setClickedBackground(DEFAULT_BACKGROUND);
          closeDialog();
        });
      }
    };

  const handlePageChange = (newPage: number) => {
    update(['backgrounds', 'page'], newPage);
  };

  const handlePerRowsChange = (newPerPage: number) => {
    update(['backgrounds', 'limit'], newPerPage);
  };

  const deleteBackgroundMobile = async () => {
    if (clickedBackground?.id) {
      const backgroundId = clickedBackground?.id;
      await BackgroundApi.removeMobile(backgroundId);

      const newBackgrounds = data.map((item) =>
        item.id === backgroundId
          ? {
              ...item,
              url_mobile: null,
            }
          : item
      );
      const { url_mobile, ...newClickedBackground } = clickedBackground;
      setClickedBackground(newClickedBackground);
      update(['backgrounds', 'data'], newBackgrounds);
    }
  };

  // we can have only when one default background by category
  const isCategoryAlreadyHaveDefaultBackground = (
    background: CreateBackgroundDto
  ) =>
    Boolean(
      data.find(
        (bg) => bg.category_id === background.category_id && bg.is_default
      )?.id
    );

  const onChange =
    (field: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        field === 'is_default' ? event.target.checked : event.target.value;

      const newBackgrounds = data.map((background) =>
        background.id === clickedBackground.id
          ? { ...background, [field]: value }
          : background
      );
      update(['backgrounds', 'data'], newBackgrounds);

      setClickedBackground({
        ...clickedBackground,
        [field]: value,
      });
    };

  const updateDesktopBackgroundState = (newBackground: GetBackgroundDto) => {
    const isEdit = clickedBackground?.id > 0;
    if (isEdit) {
      const newBackgrounds = data.map((background) =>
        background.id === clickedBackground.id ? newBackground : background
      );
      update(['backgrounds', 'data'], newBackgrounds);
    } else {
      update(['backgrounds', 'data'], [...data, newBackground]);
    }

    setClickedBackground(newBackground);
  };

  const updateMobileVideoUrl = (url: string) => {
    const newBackgrounds = data.map((background) =>
      background.id === clickedBackground.id
        ? {
            ...background,
            url_mobile: url,
          }
        : background
    );
    update(['backgrounds', 'data'], newBackgrounds);
  };

  useEffect(() => {
    BackgroundApi.getAll(limit, page).then(({ data }) =>
      update(['backgrounds'], data)
    );
  }, [limit, page]);

  return (
    <>
      {(showModal.create || showModal.edit) && (
        <SaveBackgroundDialog
          deleteBackgroundMobile={deleteBackgroundMobile}
          isCategoryAlreadyHaveDefaultBackground={
            isCategoryAlreadyHaveDefaultBackground
          }
          onClose={closeDialog}
          currentBackground={clickedBackground}
          onValidateEdit={onValidateEdit}
          onChange={onChange}
          updateDesktopBackgroundState={updateDesktopBackgroundState}
          updateMobileVideoUrl={updateMobileVideoUrl}
        />
      )}

      {showModal.delete && (
        <DeleteDialog
          title={t('background.confirm_delete_background')}
          onValidate={onValidateDelete}
          onClose={closeDialog}
        />
      )}
      <BackgroundList
        data={data}
        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
        total={total}
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
        onClickNew={onClickNew}
      />
    </>
  );
};

export { BackgroundContainer };
