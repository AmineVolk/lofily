import { AxiosPromise } from 'axios';

import { CreateNoteDto } from '@/Dto/Notes/CreateNote.dto';
import { UpdateNoteDto } from '@/Dto/Notes/UpdateNote.dto';

import { api } from './api';

const getAll = (note_group_id: number): AxiosPromise =>
  api.get(`/note?note_group_id=${note_group_id}`).then((res) => res.data);

const update = (id: number, body: UpdateNoteDto): AxiosPromise => {
  return api.put(`/note/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`/note/${id}`);

const create = (body: CreateNoteDto): AxiosPromise => api.post('/note', body);

const NoteApi = {
  getAll,
  update,
  remove,
  create,
};
export { NoteApi };
