import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import { GetUserDto, GetUserDtoPagination } from '@/Dto/User/GetUserDto';
import { UserApi } from '@/services/api/UserApi';
import { logger } from '@/services/logger';

import { EditUserDialog } from './EditUserDialog';
import { UsersComponent } from './Users.component';
import { DeleteDialog } from '../common/DeleteDialog';

const UsersContainer = () => {
  const { t } = useTranslation('common');
  const [users, setUsers] = useState<GetUserDtoPagination>({
    data: [],
    total: 0,
    page: 1,
    limit: DEFAULT_PAGINATION_LIMIT,
  });
  const [showModal, setShowModal] = useState({
    delete: false,
    create: false,
    edit: false,
  });
  const [selectedUser, setSelectedUser] = useState<GetUserDto>();

  const onClickEdit = (id: number) => {
    setShowModal({ ...showModal, edit: true });
    setSelectedUser(getUserById(id));
  };

  const onClickDelete = (id: number) => {
    setShowModal({ ...showModal, delete: true });
    setSelectedUser(getUserById(id));
  };

  const getUserById = (clickedUserId: number): GetUserDto =>
    //@ts-expect-error no error
    data.find(({ id }) => id === clickedUserId);

  logger('-------- users ', users);
  logger('-------- selectedUser ', selectedUser);
  logger('-------- showModal ', showModal);

  const { data, total, page, limit } = users;

  const handlePageChange = (newPage: number) => {
    if (!data.length) return;
    logger('-------------- page changed ?');
    if (newPage !== page) {
      setUsers({
        ...users,
        page: newPage,
      });
    }
  };

  const handlePerRowsChange = (newPerPage: number) => {
    if (limit != newPerPage) {
      setUsers({
        ...users,
        limit: newPerPage,
      });
    }
  };

  const onValidateDelete = () => {
    if (selectedUser) {
      return UserApi.remove(selectedUser?.id).then(() => {
        const newUsersData = users.data.filter(
          (user) => user.id !== selectedUser?.id
        );
        setUsers({
          ...users,
          data: newUsersData,
        });
        closeDialog();
      });
    }
  };

  const onValidateEdit = () => {
    if (selectedUser) {
      return UserApi.update(selectedUser).then(() => {
        const newUsersData = users.data.map((user) => {
          if (user.id === selectedUser.id) {
            return selectedUser;
          }
          return user;
        });
        setUsers({ ...users, data: newUsersData });
        closeDialog();
      });
    }
  };

  const closeDialog = () => {
    setShowModal({ create: false, edit: false, delete: false });
    setSelectedUser(undefined);
  };

  const handleUserChange = (field: string, value: unknown) => {
    if (selectedUser) {
      setSelectedUser({
        ...selectedUser,
        [field]: value,
      });
    }
  };

  useEffect(() => {
    const getData = () =>
      UserApi.getAll(limit, page).then(({ data }) => setUsers(data));

    getData();
  }, [limit, page]);

  return (
    <>
      {showModal.delete && (
        <DeleteDialog
          title={t('background.confirm_delete_background')}
          onValidate={onValidateDelete}
          onClose={closeDialog}
        />
      )}
      {showModal.edit && selectedUser && (
        <EditUserDialog
          handleUserChange={handleUserChange}
          onClose={closeDialog}
          onValidateEdit={onValidateEdit}
          user={selectedUser}
        />
      )}
      <UsersComponent
        onClickEdit={onClickEdit}
        onClickDelete={onClickDelete}
        data={data}
        total={total}
        handlePageChange={(newPage) => handlePageChange(newPage)}
        handlePerRowsChange={handlePerRowsChange}
      />
    </>
  );
};

export { UsersContainer };
