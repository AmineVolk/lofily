import { AxiosPromise } from 'axios';

import { GetCategoryWithBackgroundsDto } from '@/Dto/CategoryBackground/GetCategoryWithBackgrounds.dto';

import { api } from './api';

const getAll = (): AxiosPromise => {
  const url = `/category`;
  return api.get(url);
};

const getAllCategoriesBackgrounds = (
  category_id: number
): AxiosPromise<GetCategoryWithBackgroundsDto[]> => {
  const url = `/category/${category_id}/backgrounds`;
  return api.get(url);
};

const CategoryApi = { getAll, getAllCategoriesBackgrounds };
export { CategoryApi };
