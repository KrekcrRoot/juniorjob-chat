import { Column, Entity } from 'typeorm';
import { Parent } from '../global/parent.entity';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

@Entity('Chats')
export class Chat extends Parent {
  @ApiProperty({
    example: v4(),
    description: 'UUID for first user',
  })
  @Column()
  first_user: string;

  @ApiProperty({
    example: v4(),
    description: 'UUID for second user',
  })
  @Column()
  second_user: string;
}
