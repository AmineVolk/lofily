import { AxiosPromise } from 'axios';

import { CreateBackgroundDto } from '@/Dto/Background/CreateBackground.dto';
import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';

import { api } from './api';

const create = (): AxiosPromise => api.post('/background');
const getAll = (limit: number, page: number): AxiosPromise => {
  const url = `/background?page=${page}&limit=${limit}`;
  return api.get(url);
};
const update = ({
  //@ts-expect-error no error
  id,
  category_id,
  is_default,
}: CreateBackgroundDto | GetBackgroundDto): AxiosPromise => {
  const body: CreateBackgroundDto = {
    category_id,
    is_default,
  };
  return api.put(`/background/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`background/${id}`);

const removeMobile = (id: number): AxiosPromise =>
  api.delete(`background/${id}/mobile`);

const removeDesktop = (id: number): AxiosPromise =>
  api.delete(`background/${id}/desktop`);

const BackgroundApi = {
  create,
  update,
  remove,
  getAll,
  removeMobile,
  removeDesktop,
};

export { BackgroundApi };
