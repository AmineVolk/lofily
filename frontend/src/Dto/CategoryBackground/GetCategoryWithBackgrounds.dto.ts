import { GetBackgroundDto } from '../GetBackground.dto';

export interface GetCategoryWithBackgroundsDto {
  id: number;
  name: string;
  is_for_premium: boolean;
  created: string;
  updated: string;
  backgrounds: GetBackgroundDto[];
}
