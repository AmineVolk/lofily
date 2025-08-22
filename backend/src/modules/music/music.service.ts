import * as fs from 'fs';

import { CreateMusicDto } from './dto/create-music.dto';
import { Helper } from 'src/utils/helper';
import { Injectable } from '@nestjs/common';
import { MUSIC_FOLDER_PATH } from 'src/constants/constants';
import { Music } from './entities/music.entity';
import { MusicRepository } from './music.repository';
import { UpdateMusicDto } from './dto/update-music.dto';
import { join } from 'path';

@Injectable()
export class MusicService {
  constructor(private musicRepository: MusicRepository) {}

  async create(createMusicDto: CreateMusicDto) {
    return this.musicRepository.save(createMusicDto);
  }

  async findAll(page: number, limit: number, sort: string) {
    const skip = (page - 1) * limit;

    const musics = await this.musicRepository.query(
      `  SELECT *, count(*) OVER() AS total 
         FROM music
         ORDER BY ${sort || 'created'} LIMIT ${limit} OFFSET ${skip}`,
    );

    const total = musics.length ? musics[0].total : 0;
    const musicsMap = musics.map((musicItem) => {
      delete musicItem.total;
      return musicItem;
    });
    return {
      data: musicsMap,
      total,
      page,
      limit,
    };
  }

  find(condition: any) {
    return this.musicRepository.find({ where: condition });
  }

  findOne(id: number) {
    return this.musicRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMusicDto: UpdateMusicDto) {
    return this.musicRepository.update(id, {
      ...updateMusicDto,
      updated: new Date(),
    });
  }

  async removeById(id: number, paths: string[]) {
    // Supprimer les fichiers physiques
    Helper.deleteFiles(paths);

    // Supprimer l'enregistrement de la base de données
    return this.musicRepository.delete(id);
  }

  async removeMusicFile(music: Music) {
    try {
      // Construire les chemins complets des fichiers à supprimer
      const filesToDelete: string[] = [];

      // Fichier audio principal
      if (music.url) {
        const audioPath = join(
          MUSIC_FOLDER_PATH,
          music.url.replace('musics/', ''),
        );
        filesToDelete.push(audioPath);
      }

      // Image de couverture
      if (music.image_url) {
        const coverPath = join(MUSIC_FOLDER_PATH, '..', music.image_url);
        filesToDelete.push(coverPath);
      }

      // Supprimer les fichiers physiques
      Helper.deleteFiles(filesToDelete);

      // Mettre à jour l'enregistrement (marquer comme supprimé)
      return this.musicRepository.update(music.id, {
        url: null,
        image_url: null,
        is_active: false,
      });
    } catch (error) {
      console.error('Error removing music files:', error);
      throw error;
    }
  }
}
