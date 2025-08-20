type PriceRecurring = {
  interval: 'month' | 'year';
};
export interface GetPriceDto {
  id: string;
  recurring: PriceRecurring;
  product: string;
  unit_amount: number;
}
