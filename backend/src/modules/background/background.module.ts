import { Background } from './entities/background.entity';
import { BackgroundController } from './background.controller';
import { BackgroundRepository } from './background.repository';
import { BackgroundService } from './background.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Background, BackgroundRepository])],
  controllers: [BackgroundController],
  providers: [BackgroundService],
  exports: [BackgroundService],
})
export class BackgroundModule {}
