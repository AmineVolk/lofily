import { AxiosPromise } from 'axios';

import { GetUserDto } from '@/Dto/User/GetUserDto';
import { UserModel } from '@/models/User';

import { api } from './api';

const save = (body: UserModel): AxiosPromise => {
  const { id } = body;
  const url = id ? `/user/${id}` : '/user';
  const method = id ? 'put' : 'post';
  return api[method](url, body);
};

const update = (body: GetUserDto): AxiosPromise => {
  const { id } = body;
  return api.put(`/user/${id}`, body);
};

const getUser = (id: string) => {
  const url = '/user/' + id;

  return api.get(url).then((res) => res.data);
};

const getAll = (limit: number, page: number): AxiosPromise => {
  const url = `/users?page=${page}&limit=${limit}`;
  return api.get(url);
};

const me = () => {
  const url = '/user-me';

  return api.get(url);
};

const getUserFromLocalStorage = () => {
  return (
    typeof window != 'undefined' &&
    JSON.parse(localStorage?.getItem('user') || '')
  );
};

const remove = (id: number) =>
  api.delete('/user/' + id).then((res) => res.data);

const exportExcel = () =>
  api.get('/user/export/excel', {
    responseType: 'arraybuffer',
    headers: { 'Content-Type': 'blob' },
  });

const UserApi = {
  save,
  getAll,
  update,
  getUser,
  getUserFromLocalStorage,
  me,
  remove,
  exportExcel,
};
export { UserApi };
