export interface GetUserDtoPagination {
  data: GetUserDto[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUserDto {
  id: number;
  created: Date;
  email: string;
  isEmailConfirmed: boolean;
  type: string;
  username: string;
  subscription_infos: SubscriptionInfos;
}

export interface SubscriptionInfos {
  amount: number;
  card_exp: string;
  currency: string;
  interval: string;
  card_last_4: string;
  customer_id: string;
  subscription_id: string;
  subscription_end: string;
  subscription_start: string;
}
