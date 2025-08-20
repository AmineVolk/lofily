import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { AzuraCastResponse } from './dto/azuracast-response.dto';
import { NotFoundException } from 'src/error/notFound.exception';
import { GetMusicDto } from './dto/get-music.dto';
import { shuffleArray } from 'src/utils/helper';

@Injectable()
export class MusicService {
  async findAll(limit: number, page?: number) {
    const baseUrl = process.env.AZURACAST_API_URL + '/api/station/1/files/list';
    const resultToGetTotalPages = await fetch(
      baseUrl + `?internal=true&rowCount=${limit}&page=1`,
      {
        headers: {
          'x-api-key': process.env.AZURACAST_API_KEY,
        },
      },
    );

    const bodyToGetTotalPages: AzuraCastResponse =
      await resultToGetTotalPages.json();

    console.log('------------ bodyToGetTotalPages ', bodyToGetTotalPages);

    if (!bodyToGetTotalPages)
      throw new NotFoundException('azuracast music not found');

    const totalPages = bodyToGetTotalPages.total_pages;

    const totalMusic = bodyToGetTotalPages.total;

    const shuffledPage = [...new Array(totalPages)]
      .map((_, i) => i)
      .sort(function () {
        return Math.random() - 0.5;
      })[0];

    const result = await fetch(
      baseUrl + `?internal=true&rowCount=${limit}&page=${shuffledPage}`,
      {
        headers: {
          'x-api-key': process.env.AZURACAST_API_KEY,
        },
      },
    );

    const body: AzuraCastResponse = await result.json();

    const rowsFiltred: GetMusicDto[] = body.rows.map(({ media, path }) => ({
      id: media.id,
      url: process.env.AZURACAST_MEDIA_URL + path,
      artist: media.artist,
      title: media.title,
      image: process.env.AZURACAST_API_URL + media.art,
      length_text: media.length_text,
      length: media.length,
      artist_link:
        typeof media.custom_fields === 'object' &&
        Object.keys(media.custom_fields).length > 0
          ? media.custom_fields['1']
          : undefined,
    }));
    const rowsShuffled = shuffleArray(rowsFiltred);

    return {
      data: rowsShuffled,
      total: body.total,
      page,
      limit,
    };
  }
}
