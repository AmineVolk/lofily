import { GetOneNoteDto } from './GetOneNote.dto';

export interface GetallNotesGroupDto {
  data: GetOneNoteDto[];
  total: number;
  page: number;
  limit: number;
}
