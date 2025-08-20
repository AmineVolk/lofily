import DataTable from 'react-data-table-component';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';

import { getTableColumns } from './TableColumns';
import { GradientButton } from '../common/GradientButton';
import { EmptyState } from '../EmptyState';

type BackgroundComponentProps = {
  data: GetBackgroundDto[];
  handlePageChange: (page: number) => void;
  handlePerRowsChange: (page: number) => void;
  onClickNew: () => void;
  onClickDelete: (id: number) => void;
  onClickEdit: (id: number) => void;
  total: number;
};
const BackgroundList = ({
  data,
  total,
  handlePageChange,
  handlePerRowsChange,
  onClickNew,
  onClickEdit,
  onClickDelete,
}: BackgroundComponentProps) => {
  const { t } = useTranslation('common');
  const [{ categories }] = useReduxState('categories');

  const mapDataToDisplayCategoryName = data.map((item) => {
    const categoryName = categories.find(
      (category) => category.id === item.category_id
    )?.name;

    return {
      ...item,
      categoryName,
    };
  });

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='mb-12 flex'>
        <h3>
          <Trans i18nKey='background.title' />
        </h3>
        <div className='flex flex-1 justify-end'>
          <GradientButton onClick={onClickNew}>
            <Trans i18nKey='background.new' />
          </GradientButton>
        </div>
      </div>
      <div>
        {data.length && categories.length ? (
          <DataTable
            columns={getTableColumns(onClickEdit, onClickDelete)}
            data={mapDataToDisplayCategoryName}
            pagination
            paginationServer
            paginationTotalRows={total}
            paginationPerPage={DEFAULT_PAGINATION_LIMIT}
            paginationRowsPerPageOptions={[10, 20, 50]}
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
          <EmptyState
            description={
              categories?.length
                ? t('background.empty_description')
                : t('background.required_categories')
            }
          />
        )}
      </div>
    </div>
  );
};
export { BackgroundList };
