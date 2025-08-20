import { Inject, Injectable } from '@nestjs/common';
import { CreateUserMusicEffectDto } from './dto/create-user-music-effect.dto';
import { UpdateUserMusicEffectDto } from './dto/update-user-music-effect.dto';
import { UserMusicEffectRepository } from './user-music-effects.repository';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { logger } from 'handlebars';

@Injectable()
export class UserMusicEffectsService {
  constructor(
    private userMusicEffectRepository: UserMusicEffectRepository,

    @Inject(REQUEST) private request: RequestModel,
  ) {}

  create(createUserMusicEffectDto: CreateUserMusicEffectDto) {
    return this.userMusicEffectRepository.save(createUserMusicEffectDto);
  }

  async findAll() {
    const { userId } = this.request;
    const userEffects = await this.userMusicEffectRepository.query(
      `
      SELECT me.*,coalesce(ume.volume,0) as volume
      FROM user_music_effect as ume
      LEFT join music_effect as me on ume.music_effect_id = me.id
      WHERE ume.user_id = $1
    `,
      [userId],
    );

    if (userEffects.length) {
      const defaultEffects = await this.userMusicEffectRepository.query(
        `
          SELECT *
          FROM music_effect
          WHERE id not in (${userEffects.map(({ id }) => id).join(',')})
        `,
      );
      return userEffects.concat(defaultEffects);
    }

    return this.userMusicEffectRepository.query(
      `
        SELECT *
        FROM music_effect
      `,
    );
  }
  findOne(id: number) {
    return this.userMusicEffectRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserMusicEffectDto: UpdateUserMusicEffectDto) {
    console.log('--- updateUserMusicEffectDto ', {
      updateUserMusicEffectDto,
      id,
    });

    return this.userMusicEffectRepository.update(
      { music_effect_id: id },
      updateUserMusicEffectDto,
    );
  }

  removeByMusicEffectId(music_effect_id: number) {
    return this.userMusicEffectRepository.delete({
      music_effect_id,
    });
  }
  remove(id: number) {
    return this.userMusicEffectRepository.delete(id);
  }
}
