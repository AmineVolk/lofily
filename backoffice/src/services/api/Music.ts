import { AxiosPromise } from 'axios';

import { CreateMusicDto } from '@/Dto/Music/CreateMusic.dto';
import { GetMusicDto } from '@/Dto/Music/GetMusic.dto';

import { api } from './api';

const create = (): AxiosPromise => api.post('/music');
const getAll = (limit: number, page: number): AxiosPromise => {
  const url = `/music?page=${page}&limit=${limit}`;
  return api.get(url);
};
const update = ({
  //@ts-expect-error no error
  id,
  title,
  artist,
  url,
  category_id,
  is_default,
  duration,
  duration_text,
  artist_link,
  image_url,
}: CreateMusicDto | GetMusicDto): AxiosPromise => {
  const body: CreateMusicDto = {
    title,
    artist,
    url,
    category_id,
    is_default,
    duration,
    duration_text,
    artist_link,
    image_url,
  };
  return api.put(`/music/${id}`, body);
};

const remove = (id: number): AxiosPromise => api.delete(`music/${id}`);

const MusicApi = {
  create,
  update,
  remove,
  getAll,
};

export { MusicApi };
