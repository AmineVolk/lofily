import { CreateMusicEffectDto } from './dto/create-music-effect.dto';
import { Injectable } from '@nestjs/common';
import { MusicEffectRepository } from './music-effects.repository';
import { UpdateMusicEffectDto } from './dto/update-music-effect.dto';
import { UserMusicEffectsService } from '../user-music-effects/user-music-effects.service';

@Injectable()
export class MusicEffectsService {
  constructor(
    private musicEffectRepository: MusicEffectRepository,
    private userMusicEffectsService: UserMusicEffectsService,
  ) {}

  create(createMusicEffectDto: CreateMusicEffectDto) {
    return this.musicEffectRepository.save(createMusicEffectDto);
  }

  async findAll(page: number, limit: number, sort: string) {
    const skip = (page - 1) * limit;

    const musicEffects = await this.musicEffectRepository.query(
      `  SELECT *, count(*) OVER() AS total 
         FROM music_effect
         ORDER BY ${sort || 'id'} LIMIT ${limit} OFFSET ${skip}`,
    );

    const total = musicEffects.length ? musicEffects[0].total : 0;
    const musicEffectsMap = musicEffects.map((musicEffect) => {
      delete musicEffect.total;
      return musicEffect;
    });
    return {
      data: musicEffectsMap,
      total,
      page,
      limit,
    };
  }

  findOne(id: number) {
    return this.musicEffectRepository.findOne({ where: { id } });
  }

  update(id: number, updateMusicEffectDto: UpdateMusicEffectDto) {
    return this.musicEffectRepository.update(id, updateMusicEffectDto);
  }

  async remove(id: number) {
    await this.musicEffectRepository.delete(id);
    return this.userMusicEffectsService.removeByMusicEffectId(id);
  }
}
