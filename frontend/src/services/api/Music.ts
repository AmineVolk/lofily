import { api } from './api';

const getAll = (limit: number, page?: number, random = false) => {
  let url = `/music?limit=${limit}`;

  if (page) {
    url = url + `&page=${page}`;
  }

  if (random) {
    url = url + `&random=true`;
  }

  return api.get(url).then((res) => res.data);
};

const getRandom = (limit = 1) => {
  return api.get(`/music/random?limit=${limit}`).then((res) => res.data);
};

const MusicApi = { getAll, getRandom };
export { MusicApi };
