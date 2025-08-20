import axios from 'axios';

import { logger } from '../logger';

const REFRESH_URL = '/auth/refresh';
const LOGIN_URL = '/auth/login';

const NO_REFRESH_ON_URLS = [REFRESH_URL, LOGIN_URL];

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    logger(
      `axios  intercept error  url "${
        err?.response?.config?.url || err.config.url
      }" status ${err?.response?.status}`
    );
    const shouldTryRefreshToken =
      err?.response?.status === 401 &&
      !NO_REFRESH_ON_URLS.includes(err?.response?.config?.url);

    if (shouldTryRefreshToken) {
      try {
        const refreshData = await api.post(REFRESH_URL);
        logger(`-refresh token success `, refreshData);
        document.location.reload();
      } catch (refreshError) {
        logger(`refresh token failed `, refreshError);
        localStorage.clear();
        return Promise.reject(err?.response);
      }
    }
    logger(`--- api err ${JSON.stringify(err.status, null, 2)}`);

    return Promise.reject(err?.response?.status);
  }
);

export { api };
