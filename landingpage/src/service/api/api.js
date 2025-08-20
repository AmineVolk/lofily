import axios from 'axios';

const REFRESH_URL = '/auth/refresh';
const LOGIN_URL = '/auth/login';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export { api };
