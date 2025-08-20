import { AxiosPromise } from 'axios';

import {
  CreatePaymentSubscription,
  CreatePaymentSubscriptionResponse,
} from '@/Dto/Payments/CreatePaymentSubscription.dto';
import { SubscriptionDoneDto } from '@/Dto/Payments/SubscriptionDone.dto';

import { api } from './api';

const createSubscription = (
  body: CreatePaymentSubscription
): AxiosPromise<CreatePaymentSubscriptionResponse> =>
  api.post('/payments/subscription', body);

const subscriptionDone = (
  body: SubscriptionDoneDto
): AxiosPromise<CreatePaymentSubscriptionResponse> =>
  api.post('/payments/subscription/done', body);

const cancleSubscription =
  (): AxiosPromise<CreatePaymentSubscriptionResponse> =>
    api.post(`/payments/subscription/cancel`);

const checkCodePromo = (code: string) =>
  api.get(`/payments/codepromo/${code}/check`).then((data) => data.data);

const PaymentApi = {
  createSubscription,
  cancleSubscription,
  subscriptionDone,
  checkCodePromo,
};
export { PaymentApi };
