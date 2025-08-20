import { IsNumber } from "class-validator";

export class Pageable {
  constructor(totalCount, pageNumber, pageSize) {
    this.totalCount = totalCount;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }

  @IsNumber()
  totalCount: number;

  @IsNumber()
  pageNumber: string;

  @IsNumber()
  pageSize: string;
}
