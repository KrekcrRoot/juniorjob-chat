import { Column, Entity } from 'typeorm';
import { Parent } from '../global/parent.entity';

@Entity('Chats')
export class Chat extends Parent {

  @Column()
  first_user: string

  @Column()
  second_user: string;

}