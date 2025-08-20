import {
  BACKGROUND_FOLDER_PATH,
  THUMBNAIL_FOLDER_PATH,
  THUMBNAIL_FOLDER_PATH_API,
} from 'src/constants/constants';
import { Helper, createThumbnail } from 'src/utils/helper';

import { Background } from './entities/background.entity';
import { BackgroundRepository } from './background.repository';
import { CreateBackgroundDto } from './dto/create-background.dto';
import { Injectable } from '@nestjs/common';
import { UpdateBackgroundDto } from './dto/update-background.dto';

@Injectable()
export class BackgroundService {
  constructor(private backgroundRepository: BackgroundRepository) {}

  // make sur to have only on default background
  resetDefaultBackground(category_id: number) {
    return this.backgroundRepository
      .createQueryBuilder()
      .update(Background)
      .set({ is_default: false })
      .where({ is_default: true, category_id })
      .execute();
  }

  async create(createBackgroundDto: CreateBackgroundDto) {
    if (createBackgroundDto.is_default) {
      await this.resetDefaultBackground(createBackgroundDto.category_id);
    }
    return this.backgroundRepository.save(createBackgroundDto);
  }

  async findAll(page: number, limit: number, sort: string) {
    const skip = (page - 1) * limit;

    const backgrounds = await this.backgroundRepository.query(
      `  SELECT *, count(*) OVER() AS total 
         FROM background
         ORDER BY ${sort || 'created'} LIMIT ${limit} OFFSET ${skip}`,
    );

    const total = backgrounds.length ? backgrounds[0].total : 0;
    const backgroundsMap = backgrounds.map((cateogryItem) => {
      delete cateogryItem.total;
      return cateogryItem;
    });
    return {
      data: backgroundsMap,
      total,
      page,
      limit,
    };
  }

  find(condition: any) {
    return this.backgroundRepository.find({ where: condition });
  }

  findDefaultPublic() {
    return this.backgroundRepository.query(`
      SELECT b.*
      from background as b
      join category as c on c.id = b.category_id
      where c.is_for_premium = false and b.is_default
      limit 1
    `);
  }

  findOne(id: number) {
    return this.backgroundRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBackgroundDto: UpdateBackgroundDto) {
    if (updateBackgroundDto.is_default) {
      await this.resetDefaultBackground(updateBackgroundDto.category_id);
    }
    return this.backgroundRepository.update(id, {
      ...updateBackgroundDto,
      updated: new Date(),
    });
  }

  removeById(id: number, paths: string[]) {
    Helper.deleteFiles(paths);
    return this.backgroundRepository.delete(id);
  }

  async removeMobileBackground(background: Background) {
    Helper.deleteFiles([background.url_mobile]);
    return this.backgroundRepository.update(background.id, {
      url_mobile: null,
    });
  }

  async removeDesktopBackground(background: Background) {
    Helper.deleteFiles([background.url]);
    return this.backgroundRepository.update(background.id, {
      url: null,
    });
  }
  generateMissingThumbnail = async () => {
    const backgrounds = await this.backgroundRepository.find({
      where: { thumbnail: null },
    });
    for (let index = 0; index < backgrounds.length; index++) {
      const background = backgrounds[index];

      const thumbnailFileName =
        background.url.split('/')[1].split('.')[0] + '.png';

      const thumbnailUrl = THUMBNAIL_FOLDER_PATH_API + thumbnailFileName;
      await createThumbnail(
        BACKGROUND_FOLDER_PATH + background.url.split('/')[1],
        THUMBNAIL_FOLDER_PATH + thumbnailFileName,
      );

      await this.backgroundRepository.update(background.id, {
        thumbnail: thumbnailUrl,
      });
    }
  };

  generateMissingThumbnailMobile = async () => {
    const backgrounds = await this.backgroundRepository.find({
      where: { thumbnail_mobile: null },
    });
    for (let index = 0; index < backgrounds.length; index++) {
      const background = backgrounds[index];

      const thumbnailFileName =
        background.url_mobile.split('/')[1].split('.')[0] + '.png';

      const thumbnailUrl = THUMBNAIL_FOLDER_PATH_API + thumbnailFileName;
      await createThumbnail(
        BACKGROUND_FOLDER_PATH + background.url_mobile.split('/')[1],
        THUMBNAIL_FOLDER_PATH + thumbnailFileName,
        '500x620',
      );

      await this.backgroundRepository.update(background.id, {
        thumbnail_mobile: thumbnailUrl,
      });
    }
  };

  // removeByCategory(category_id: number, paths: string[]) {
  //   Helper.deleteFiles(paths);
  //   return this.backgroundRepository.delete({ category: category_id });
  // }
}
