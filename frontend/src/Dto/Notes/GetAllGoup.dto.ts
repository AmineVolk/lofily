import { GetOneGroupDto } from './GetOneGroup.dto';

export interface GetOneGroupDtoWithStats extends GetOneGroupDto {
  nbr_notes: number;
}

export interface GetAllGoupDto {
  data: GetOneGroupDtoWithStats[];
  total: number;
  page: number;
  limit: number;
}
