import { AxiosPromise } from 'axios';

import { ForgotPasswordDto } from '@/Dto/User/ForgotPassword.dto';
import { LoginDto } from '@/Dto/User/Login.dto';
import { RegisterDto } from '@/Dto/User/Register.dto';
import { ResetPasswordDto } from '@/Dto/User/ResetPassword.dto';
import { RefreshBodyDto } from '@/models/RefreshBodyDto';

import { api } from './api';

const refreshSocialMediaToken = (body: RefreshBodyDto): AxiosPromise => {
  return api.post('/auth/refresh/socialmedia', body);
};

const logout = () => api.get('/auth/logout');

const register = (body: RegisterDto): AxiosPromise =>
  api.post('/register', body);

const login = (body: LoginDto): AxiosPromise =>
  api.post('/auth/login', {
    ...body,
    email: body.email.toLowerCase(),
  });

const confirmRegister = (token: string) =>
  api.post(`/email/confirm`, { token });

const forgotPassword = (body: ForgotPasswordDto) =>
  api.post('/password/forgot', body);

const resetPassword = (body: ResetPasswordDto) =>
  api.post('/password/reset', body);

const AuthApi = {
  refreshSocialMediaToken,
  logout,
  register,
  confirmRegister,
  login,
  forgotPassword,
  resetPassword,
};
export { AuthApi };
