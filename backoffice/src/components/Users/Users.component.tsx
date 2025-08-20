import { Trans, useTranslation } from 'react-i18next';

import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import DataTable from 'react-data-table-component';
import { EmptyState } from '../EmptyState';
import { GetUserDto } from '@/Dto/User/GetUserDto';
import Image from 'next/image';
import { UserApi } from '@/services/api/UserApi';
import { getTableColumns } from './TableColumns';

type UsersComponentProps = {
  data: GetUserDto[];
  handlePageChange: (page: number) => void;
  handlePerRowsChange: (page: number) => void;
  total: number;

  onClickEdit: (id: number) => void;
  onClickDelete: (id: number) => void;
};

const UsersComponent = ({
  data,
  total,
  handlePageChange,
  handlePerRowsChange,
  onClickEdit,
  onClickDelete,
}: UsersComponentProps) => {
  const { t } = useTranslation('common');

  const handleDownloadUsersExcel = async () => {
    const resp = await UserApi.exportExcel();
    const link = document.createElement('a');
    link.setAttribute(
      'download',
      `lofilyUsers-${new Date().toISOString()}.xlsx`
    );
    link.href = URL.createObjectURL(new Blob([resp.data]));
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='mb-12 flex'>
        <h3>
          <Trans i18nKey='users.title' />
        </h3>
        <div className='flex flex-1 justify-end'>
          <a
            onClick={() => handleDownloadUsersExcel()}
            href='#'
            className='flex items-center justify-center space-x-4 rounded-md bg-secondary-base px-4   py-2 font-bold text-white'
          >
            <Image
              src='/images/export.svg'
              alt='export icon'
              width={22}
              height={22}
            />
            <p>
              <Trans i18nKey='export_excel' />
            </p>
          </a>
        </div>
      </div>
      <div className='overflow-y-auto'>
        {data.length ? (
          <DataTable
            columns={getTableColumns(onClickEdit, onClickDelete)}
            data={data}
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
          <EmptyState description={t('category.empty_description')} />
        )}
      </div>
    </div>
  );
};

export { UsersComponent };
