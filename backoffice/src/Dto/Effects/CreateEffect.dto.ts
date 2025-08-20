export class CreateEffectDto {
  name: string;

  constructor(name?: string) {
    this.name = name || '';
  }
}
