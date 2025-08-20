import { DEFAULT_PAGINATION_LIMIT } from '@/constant';
import { GetBackgroundDto } from '@/Dto/Background/GetBackground.dto';
import { GetCategoryDto } from '@/Dto/Category/GetCategory.dto';
import { GetEffectDto } from '@/Dto/Effects/GetEffect.dto';

export type StoreType = {
  currentMenuItem: number;
  backgrounds: {
    data: GetBackgroundDto[];
    total: number;
    page: number;
    limit: number;
  };
  effects: {
    data: GetEffectDto[];
    total: number;
    page: number;
    limit: number;
  };
  categories: GetCategoryDto[];
};
const Store: StoreType = {
  currentMenuItem: 0,
  backgrounds: {
    data: [],
    total: 0,
    page: 1,
    limit: DEFAULT_PAGINATION_LIMIT,
  },
  effects: {
    data: [],
    total: 0,
    page: 1,
    limit: DEFAULT_PAGINATION_LIMIT,
  },

  categories: [],
};
export { Store };
