import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Put,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Inject,
} from '@nestjs/common';
import { NoteGroupService } from './note-group.service';
import { CreateNoteGroupDto } from './dto/create-note-group.dto';
import { UpdateNoteGroupDto } from './dto/update-note-group.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { DEFAULT_PAGINATION_LIMIT } from 'src/constants/constants';

@Controller('note-group')
@UseGuards(JwtAuthGuard)
@UseInterceptors(RequestInterceptor)
export class NoteGroupController {
  constructor(private readonly noteGroupService: NoteGroupService) {}

  @Post()
  create(@Body() createNoteGroupDto: CreateNoteGroupDto) {
    return this.noteGroupService.create(createNoteGroupDto);
  }

  @Get()
  findAll(
    @Query('sort') sort: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
  ) {
    return this.noteGroupService.findAll(page, limit, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteGroupService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateNoteGroupDto: UpdateNoteGroupDto,
  ) {
    return this.noteGroupService.update(id, updateNoteGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteGroupService.remove(+id);
  }
}
