import { IsUUID } from 'class-validator';

export class UUID {
  @IsUUID()
  uuid: string;
}
