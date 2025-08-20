import { AxiosPromise } from 'axios';

import { CreateGroupDto } from '@/Dto/Notes/CreateGroup.dto';
import { UpdateGroupDto } from '@/Dto/Notes/UpdateGroup.dto';

import { api } from './api';

const getAll = (): AxiosPromise =>
  api.get('/note-group').then((res) => res.data);

const update = (id: number, body: UpdateGroupDto): AxiosPromise => {
  return api.put(`/note-group/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`/note-group/${id}`);

const create = (body: CreateGroupDto): AxiosPromise =>
  api.post('/note-group', body);

const NoteGroupApi = {
  getAll,
  update,
  remove,
  create,
};
export { NoteGroupApi };
