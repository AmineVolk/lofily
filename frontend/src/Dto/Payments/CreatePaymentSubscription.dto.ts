export interface CreatePaymentSubscription {
  price_id: string;
  payment_method_id: string;
  promocode?: string;
}

export interface CreatePaymentSubscriptionResponse {
  client_secret: string;
  subscription_id: string;
  customer_id: string;
}
