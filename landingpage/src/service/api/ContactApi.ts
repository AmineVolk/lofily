import { AxiosPromise } from 'axios';

import { ContactDto } from '@/DTO/contact.dto';

import { api } from './api';

const sendContact = (body: ContactDto): AxiosPromise => {
  return api.post('email/contact', body);
};

const ContactApi = {
  sendContact,
};
export { ContactApi };
