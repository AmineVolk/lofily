import { Inject, Injectable } from '@nestjs/common';
import { CreateNoteGroupDto } from './dto/create-note-group.dto';
import { UpdateNoteGroupDto } from './dto/update-note-group.dto';
import { NoteGroupRepository } from './note-group.repository';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { BadRequestException } from 'src/error/badRequest.exception';

@Injectable()
export class NoteGroupService {
  constructor(
    private noteGroupRepository: NoteGroupRepository,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  findByNameQuery = 'SELECT * FROM note_group WHERE name=$1 AND user_id=$2';

  async create(createNoteGroupDto: CreateNoteGroupDto) {
    const { userId } = this.request;

    const noteGroup = await this.findNoteGroupByName(
      createNoteGroupDto.name,
      userId,
    );
    if (noteGroup.length !== 0) {
      throw new BadRequestException('The name has to be unique');
    }

    createNoteGroupDto.user_id = userId;
    return this.noteGroupRepository.save(createNoteGroupDto);
  }

  findNoteGroupByName = async (name, userId) => {
    const query = this.findByNameQuery;

    const noteGroup = await this.noteGroupRepository.query(query, [
      name,
      userId,
    ]);

    return noteGroup;
  };

  // the total of notes has to be provided in the response
  async findAll(page: number, limit: number, sort: string) {
    const { userId } = this.request;
    const skip = (page - 1) * limit;

    const query = `with notes as (
                    select  note_group_id, count(note.id)::int as nbr_notes 
                    from note
                    group by (note_group_id)
                  )
                  SELECT distinct(ng.*), COALESCE(n.nbr_notes,0) as nbr_notes , count(ng.id) OVER() AS total
                  from note_group as ng 
                  LEFT JOIN notes as n on n.note_group_id = ng.id
                  WHERE user_id = $1 
                  ORDER BY ${sort || 'created'} LIMIT ${limit} OFFSET ${skip}`;

    const noteGroups = await this.noteGroupRepository.query(query, [userId]);

    const total = noteGroups[0]?.total || 0;
    const groupOfNotes = noteGroups.map((noteGroupItem) => {
      delete noteGroupItem.total;
      return noteGroupItem;
    });

    return {
      data: groupOfNotes,
      total: Number(total),
      page,
      limit,
    };
  }

  findOne(id: number) {
    return this.noteGroupRepository.findOne({ where: { id } });
  }

  async update(id: number, updateNoteGroupDto: UpdateNoteGroupDto) {
    const { userId } = this.request;

    const query = this.findByNameQuery + ' AND id!=$3';
    const noteGroup = await this.noteGroupRepository.query(query, [
      updateNoteGroupDto.name,
      userId,
      id,
    ]);
    if (noteGroup.length !== 0) {
      throw new BadRequestException('The name has to be unique');
    }

    return this.noteGroupRepository.update(id, {
      ...updateNoteGroupDto,
      updated: new Date(),
    });
  }

  remove(id: number) {
    const { userId } = this.request;

    return this.noteGroupRepository.query(
      `delete from note_group where id=$1 and user_id=$2`,
      [id, userId],
    );
  }
}
