import { AxiosPromise } from 'axios';

import { LoginDto } from '@/Dto/Login.dto';
import { RefreshBodyDto } from '@/Dto/RefreshBodyDto';

import { api } from './api';

const refreshSocialMediaToken = (body: RefreshBodyDto): AxiosPromise => {
  return api.post('/auth/refresh/socialmedia', body);
};

const logout = () => api.get('/auth/logout').then(() => localStorage.clear());

const login = (loginDto: LoginDto) => api.post('/auth/login', loginDto);

const AuthApi = {
  refreshSocialMediaToken,
  logout,
  login,
};
export { AuthApi };
