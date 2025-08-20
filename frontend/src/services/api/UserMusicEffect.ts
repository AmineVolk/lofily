import { AxiosPromise } from 'axios';

import { CreateUserMuiscEffect } from '@/Dto/UserMusicEffect/CreateUserMusicEffect.dto';
import { UpdateUserMuiscEffect } from '@/Dto/UserMusicEffect/UpdateUserMuiscEffect.dto';

import { api } from './api';

const create = (body: CreateUserMuiscEffect): AxiosPromise => {
  return api.post(`/user-music-effects`, body);
};

const update = (id: number, body: UpdateUserMuiscEffect): AxiosPromise => {
  return api.put(`/user-music-effects/${id}`, body);
};

const getAll = () => {
  return api.get('/user-music-effects').then((res) => res.data);
};

const UserMusicEffectApi = { create, update, getAll };
export { UserMusicEffectApi };
