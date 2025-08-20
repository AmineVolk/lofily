import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Trans, useTranslation } from 'react-i18next';

import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import { CreateEffectDto } from '@/Dto/Effects/CreateEffect.dto';
import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';
import { logger } from '@/services/logger';

import { SaveEffectDialog } from './SaveEffectDialog';
import { getTableColumns } from './TableColumns';
import { DeleteDialog } from '../common/DeleteDialog';
import { GradientButton } from '../common/GradientButton';
import { EmptyState } from '../EmptyState';

type EffectComponentProps = {
  data: GetEffectDto[];
  onValidateEdit: (
    index: number | null,
    onCloseDialog: () => void
  ) => (editedEffect: CreateEffectDto | GetEffectDto) => () => void;
  onValidateDelete: (
    id: number,
    onCloseDialog: () => void,
    index: number
  ) => () => void;
  handlePageChange: (page: number) => void;
  handlePerRowsChange: (page: number) => void;
  total: number;
};

const EffectComponent = ({
  data,
  total,
  onValidateDelete,
  onValidateEdit,
  handlePageChange,
  handlePerRowsChange,
}: EffectComponentProps) => {
  const { t } = useTranslation('common');

  const [clickedEffect, setClickedEffect] = useState<GetEffectDto | null>(null);

  const [showModal, setShowModal] = useState({
    delete: false,
    create: false,
    edit: false,
  });

  const [currentEffectIndex, setCurrentEffectIndex] = useState<number | null>(
    null
  );

  const closeDialog = () => {
    setShowModal({ create: false, edit: false, delete: false });
    setClickedEffect(null);
    setCurrentEffectIndex(null);
  };

  const onClickNew = () => {
    setShowModal({
      ...showModal,
      create: true,
    });
  };

  const onClickEdit = (index: number) => {
    setShowModal({ ...showModal, edit: true });
    setCurrentEffectIndex(index);
    setClickedEffect(getEffectByIndex(index));
  };

  const onClickDelete = (index: number) => {
    setShowModal({ ...showModal, delete: true });
    setCurrentEffectIndex(index);
    setClickedEffect(getEffectByIndex(index));
  };

  const getEffectByIndex = (
    clickedCateogryIndex: number
  ): GetEffectDto | null => {
    const result =
      data.find((_, index) => index === clickedCateogryIndex) || null;
    return result;
  };

  const shouldDisplayDelete =
    clickedEffect && showModal.delete && typeof currentEffectIndex === 'number';

  logger('shouldDisplayDelete ', shouldDisplayDelete);
  const shouldDisplaySaveDialog = showModal.create || showModal.edit;

  // const [play, { pause }] = useSound(
  //   process.env.NEXT_PUBLIC_BACKEND_URL +
  //     getEffectByIndex(currentEffectIndex)?.url
  // );

  return (
    <div className='flex h-full flex-1 flex-col'>
      {shouldDisplayDelete && (
        <DeleteDialog
          title={t('effects.confirm_delete_effect')}
          onValidate={onValidateDelete(
            clickedEffect.id,
            closeDialog,
            currentEffectIndex
          )}
          onClose={closeDialog}
        />
      )}

      {shouldDisplaySaveDialog && (
        <SaveEffectDialog
          onClose={closeDialog}
          effectToEdit={clickedEffect}
          onValidateEdit={onValidateEdit(currentEffectIndex, closeDialog)}
        />
      )}

      <div className='mb-12 flex'>
        <h3>
          <Trans i18nKey='effects.title' />
        </h3>
        <div className='flex flex-1 justify-end'>
          <GradientButton onClick={onClickNew}>
            <Trans i18nKey='effects.new' />
          </GradientButton>
        </div>
      </div>
      <>
        {data.length ? (
          <DataTable
            columns={getTableColumns(onClickEdit, onClickDelete)}
            data={data}
            pagination
            paginationServer
            paginationTotalRows={total}
            paginationPerPage={DEFAULT_PAGINATION_LIMIT}
            paginationRowsPerPageOptions={[10, 20]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#F4F6F8',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottom: 0,
                  marginBottom: 5,
                  fontWeight: 600,
                },
              },
              rows: {
                style: {
                  borderBottom: '0 !important',
                },
              },
            }}
          />
        ) : (
          <EmptyState description={t('effects.empty_description')} />
        )}
      </>
    </div>
  );
};
export { EffectComponent };
