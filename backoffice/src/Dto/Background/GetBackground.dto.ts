export interface GetBackgroundDto {
  id: number;
  url: string;
  category_id: number;
  is_default: boolean;

  url_mobile?: string;
}
export interface GetBackgroundDtoPagination {
  data: GetBackgroundDto[];
  total: number;
  page: number;
  limit: number;
}
