import { AxiosPromise } from 'axios';

import { CreateCategoryDto } from '@/Dto/Category/CreateCategory.dto';
import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { UpdateCategoryDto } from '@/Dto/Category/UpdateCategory.dto';
import { UpdateCategoryOrderDto } from '@/Dto/Category/UpdateCategoryOrder.dto';

import { api } from './api';

const create = (body: CreateCategoryDto): AxiosPromise =>
  api.post('/category', body);

const getAll = (): AxiosPromise => {
  const url = `/category`;
  return api.get(url);
};

const update = ({
  name,
  is_for_premium,
  id,
  is_new,
}: GetCategoryDto): AxiosPromise => {
  const body: UpdateCategoryDto = {
    name,
    is_for_premium,
    is_new,
  };
  return api.put(`/category/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`category/${id}`);
const updateOrder = (body: UpdateCategoryOrderDto) =>
  api.post('/category/order', body);
const CategoryApi = { create, getAll, update, remove, updateOrder };
export { CategoryApi };
