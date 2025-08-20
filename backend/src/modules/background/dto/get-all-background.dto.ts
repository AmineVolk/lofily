import { GetOneBackgroundDto } from './get-one-background.dto';

export class GetAllBackgroundDto {
  data: GetOneBackgroundDto[];
  total: number;
  page: number;
  limit: number;
}
