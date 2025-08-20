import { AxiosPromise } from 'axios';

import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';

import { api } from './api';

const create = (): AxiosPromise => api.post('/music-effects');

const getAll = (limit: number, page: number): AxiosPromise => {
  const url = `/music-effects?page=${page}&limit=${limit}`;
  return api.get(url);
};

const update = (id: number, body: GetEffectDto): AxiosPromise => {
  return api.put(`/music-effects/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`music-effects/${id}`);
const EffectApi = { create, update, remove, getAll };

export { EffectApi };
