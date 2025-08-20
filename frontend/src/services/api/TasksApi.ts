import { AxiosPromise } from 'axios';

import { GetTask } from '@/Dto/Tasks/GetTask.dto';

import { api } from './api';

const save = (body: GetTask): AxiosPromise => {
  return api.post('/tasks', body);
};

const update = (body: GetTask): AxiosPromise => {
  return api.put(`/tasks/${body.id}`, body);
};

const getAllUserTasks = () => {
  return api.get('/tasks').then((res) => res.data);
};

const remove = (id: number) => {
  const url = '/tasks/' + id;

  return api.delete(url).then((res) => res.data);
};

const TasksApi = {
  save,
  update,
  remove,
  getAllUserTasks,
};
export { TasksApi };
