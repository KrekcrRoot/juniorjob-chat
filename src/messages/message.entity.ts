import { Parent } from '../global/parent.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Chat } from '../chats/chat.entity';
import { ApiProperty } from '@nestjs/swagger';
import { v4 } from 'uuid';

@Entity('Messages')
export class Message extends Parent {
  @ApiProperty({
    example: 'Lorem ipsum se dolor',
    description: 'Content of message',
  })
  @Column()
  content: string;

  @ApiProperty({
    example: v4(),
    description: 'Chat relation of message',
  })
  @ManyToOne(() => Chat, (chat) => chat.uuid)
  @JoinColumn()
  chat: Chat;

  @ApiProperty({
    example: v4(),
    description: 'UUID of creator (user)',
  })
  @Column()
  user: string;

  @ApiProperty({
    example: v4(),
    description: 'UUID of replied message',
  })
  @ManyToOne(() => Message, (message) => message.uuid, { nullable: true })
  @JoinColumn()
  replied: Message | null;

  @ApiProperty({
    example: false,
    description: 'Marker of read message',
  })
  @Column({ default: false })
  read: boolean;
}
