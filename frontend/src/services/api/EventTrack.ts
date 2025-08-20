import { AxiosPromise } from 'axios';

import { CreateEventTrackDto } from '@/Dto/EventTrack/CreateEventTrack.dto';
import { CreatePaymentSubscriptionResponse } from '@/Dto/Payments/CreatePaymentSubscription.dto';

import { api } from './api';

const createTimeSpentEvent = (
  body: CreateEventTrackDto
): AxiosPromise<CreatePaymentSubscriptionResponse> =>
  api.post('/event-track', body);

const EventTrackApi = {
  createTimeSpentEvent,
};
export { EventTrackApi };
