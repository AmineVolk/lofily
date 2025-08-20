import { Pageable } from "./pageable-infos";

export class ApiResponse {
  constructor(content, pageable) {
    this.content = content;
    this.pageable = pageable;
  }

  content: number;

  pageable: Pageable;
}
