import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DEFAULT_PAGINATION_LIMIT } from 'src/constants/constants';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt-auth.guard';
import { NoteGroupService } from '../note-group/note-group.service';
import { log } from 'console';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { RequestModel } from 'src/overrid/request';
import { REQUEST } from '@nestjs/core';

@UseInterceptors(RequestInterceptor)
@Controller('note')
@UseGuards(JwtAuthGuard)
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly noteGroupService: NoteGroupService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    const noteGroup = await this.noteGroupService.findOne(
      createNoteDto.note_group_id,
    );
    if (!noteGroup) {
      throw new NotFoundException('Note group not found');
    }
    return this.noteService.create(createNoteDto);
  }

  @Get()
  findAll(
    @Query('note_group_id', new DefaultValuePipe(1), ParseIntPipe)
    note_group_id: number,
    @Query('sort') sort: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
  ) {
    return this.noteService.findAllByGroup(note_group_id, page, limit, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.noteService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateNoteDto: UpdateNoteDto) {
    const noteGroup = await this.noteGroupService.findOne(
      updateNoteDto.note_group_id,
    );
    if (!noteGroup) {
      throw new NotFoundException('Note group not found');
    }
    return this.noteService.update(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.noteService.remove(id);
  }
}
