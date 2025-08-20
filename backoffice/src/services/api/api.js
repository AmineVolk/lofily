import axios from 'axios';

import { logger } from '../logger';

const REFRESH_URL = '/auth/refresh';
// using this to use form data
// axios.defaults.headers.post['Content-Type'] =
//   'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
// api.logout = function () {
//   return this.get('/logout').then(() => {
//     window.location.reload()
//   })
// }

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
      err?.response?.config?.url !== REFRESH_URL;
    logger('shouldTryRefreshToken ', shouldTryRefreshToken);

    if (shouldTryRefreshToken) {
      try {
        const refreshData = await api.post(REFRESH_URL);
        logger(`-refresh token success `, refreshData);
        document.location.reload();
      } catch (refreshError) {
        logger(`refresh token failed `, refreshError);
        return Promise.reject(err?.response);
      }
    }

    return Promise.reject(err?.status || err?.response?.status);
  }
);

export { api };
