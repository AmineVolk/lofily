import { AxiosPromise } from 'axios';

import { ContactDto } from '@/Dto/Contact.dto';
import UpdateUserPasswordDto from '@/Dto/User/UpdatePassword.dto';
import { UpdateUserDto } from '@/Dto/User/UpdateUser.dto';
import { UserModel } from '@/models/User';

import { api } from './api';

const save = (body: UserModel): AxiosPromise => {
  const { id } = body;
  const url = id ? `/user/${id}` : '/user';
  const method = id ? 'put' : 'post';
  return api[method](url, body);
};
const update = (id: number, body: UpdateUserDto): AxiosPromise => {
  return api.put(`/user/${id}`, body);
};

const getUser = (id: string) => {
  const url = '/user/' + id;

  return api.get(url).then((res) => res.data);
};

const me = () =>
  api.get('/user-me').then(({ data }) => {
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  });

const sendContact = (body: ContactDto): AxiosPromise => {
  return api.post('email/contact', body);
};

const updatePassword = (body: UpdateUserPasswordDto) =>
  api.put('/password', body);

const UserApi = {
  save,
  update,
  getUser,
  me,
  sendContact,
  updatePassword,
};
export { UserApi };
