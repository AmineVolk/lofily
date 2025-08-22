import DataTable from 'react-data-table-component';
import { Trans, useTranslation } from 'react-i18next';

import { useReduxState } from '@/hooks/useReduxState';

import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';

import { getTableColumns } from './TableColumns';
import { GradientButton } from '../common/GradientButton';
import { EmptyState } from '../EmptyState';

type MusicComponentProps = {
  data: GetMusicDto[];
  handlePageChange: (page: number) => void;
  handlePerRowsChange: (page: number) => void;
  onClickNew: () => void;
  onClickDelete: (id: number) => void;
  total: number;
};
const MusicList = ({
  data,
  total,
  handlePageChange,
  handlePerRowsChange,
  onClickNew,
  onClickDelete,
}: MusicComponentProps) => {
  const { t } = useTranslation('common');
  const [{ categories }] = useReduxState('categories');

  // Debug: voir ce que contient data
  console.log(
    'MusicList data:',
    data,
    'type:',
    typeof data,
    'isArray:',
    Array.isArray(data)
  );

  const mapDataToDisplayName = (Array.isArray(data) ? data : []).map((item) => {
    return {
      ...item,
    };
  });

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='mb-12 flex'>
        <h3>
          <Trans i18nKey='music.title' />
        </h3>
        <div className='flex flex-1 justify-end'>
          <GradientButton onClick={onClickNew}>
            <Trans i18nKey='music.new' />
          </GradientButton>
        </div>
      </div>
      <div>
        {Array.isArray(data) && data.length ? (
          <DataTable
            columns={getTableColumns(onClickDelete)}
            data={mapDataToDisplayName}
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
                ? t('music.empty_description')
                : t('music.required_categories')
            }
          />
        )}
      </div>
    </div>
  );
};
export { MusicList };
