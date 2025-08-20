import { Module } from '@nestjs/common';
import { NoteGroupService } from './note-group.service';
import { NoteGroupController } from './note-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteGroup } from './entities/note-group.entity';
import { NoteGroupRepository } from './note-group.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([NoteGroup, NoteGroupRepository]),
  ],
  controllers: [NoteGroupController],
  providers: [NoteGroupService],
  exports: [NoteGroupService],
})
export class NoteGroupModule {}
