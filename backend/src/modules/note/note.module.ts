import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NoteRepository } from './note.repository';
import { NoteGroupModule } from '../note-group/note-group.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    TypeOrmModule.forFeature([Note, NoteRepository]),
    NoteGroupModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
