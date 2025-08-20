import { Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BackgroundController } from './background.controller';
import { Background } from './entities/background.entity';
import { BackgroundRepository } from './background.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([Background, BackgroundRepository]),
  ],
  controllers: [BackgroundController],
  providers: [BackgroundService],
  exports: [BackgroundService],
})
export class BackgroundModule {}
