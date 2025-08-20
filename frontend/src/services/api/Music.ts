import { api } from './api';

const getAll = (limit: number, page?: number) => {
  let url = `/music?limit=${limit}`;

  if (page) {
    url = url + `&page=${page}`;
  }
  return api.get(url).then((res) => res.data);
};

const MusicApi = { getAll };
export { MusicApi };
