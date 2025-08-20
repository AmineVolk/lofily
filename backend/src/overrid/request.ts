import { Request } from 'express';

export interface RequestModel extends Request {
  userId: string;
  email: string;
}
