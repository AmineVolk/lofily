import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';

@Injectable()
export class NoteService {
  constructor(
    private noteRepository: NoteRepository,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  //check if he's updating his own note
  async checkUserGroupAccess(note_group_id: number) {
    const { userId } = this.request;

    const noteGroup = await this.noteRepository.query(
      `
        SELECT * FROM note_group WHERE id=$1 and user_id = $2
      `,
      [note_group_id, userId],
    );
    if (!noteGroup.length) {
      throw new ForbiddenException('Resource not allowed');
    }
  }

  async create(createNoteDto: CreateNoteDto) {
    await this.checkUserGroupAccess(createNoteDto.note_group_id);
    return this.noteRepository.save(createNoteDto);
  }

  async findAllByGroup(note_group_id, page, limit, sort) {
    const skip = (page - 1) * limit;
    const { userId } = this.request;

    const query = `SELECT note.* , count(*) OVER() AS total 
                   FROM note 
                   JOIN note_group as ng on ng.id = note.note_group_id
                   WHERE ng.id = $1 and ng.user_id = $2
                   ORDER BY ${sort || 'created'} LIMIT ${limit} OFFSET ${skip}`;

    const notes = await this.noteRepository.query(query, [
      note_group_id,
      userId,
    ]);

    const total = notes.length ? notes[0].total : 0;
    const notesMap = notes.map((noteGroupItem) => {
      delete noteGroupItem.total;
      return noteGroupItem;
    });

    return {
      data: notesMap,
      total: Number(total),
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const { userId } = this.request;

    const note = await this.noteRepository.query(
      `
      SELECT note.*
      FROM note
      JOIN note_group as ng on ng.id = note.note_group_id
      where note.id = $1 and ng.user_id = $2
    `,
      [id, userId],
    );
    if (!note) {
      throw new ForbiddenException('Resource not allowed');
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.checkUserGroupAccess(updateNoteDto.note_group_id);

    return this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number) {
    const { userId } = this.request;

    const noteGroup = await this.noteRepository.query(
      `
        SELECT note.*
        FROM note
        JOIN note_group as ng on ng.id = note.note_group_id
        where note.id = $1 and ng.user_id = $2
      `,
      [id, userId],
    );
    if (!noteGroup.length) {
      throw new ForbiddenException('Resource not allowed');
    }
    return this.noteRepository.delete(id);
  }
}
