import { Parent } from '../global/parent.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Chat } from '../chats/chat.entity';

@Entity('Messages')
export class Message extends Parent {
  @Column()
  content: string;

  @ManyToOne(() => Chat, (chat) => chat.uuid)
  @JoinColumn()
  chat: Chat;

  @Column()
  user: string;
}
