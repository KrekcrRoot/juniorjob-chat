import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message, 'chat')
    private messagesRepository: Repository<Message>,
  ) {}

  async uuid(message_uuid: string): Promise<Message> {
    return this.messagesRepository.findOne({
      where: {
        banned: false,
        uuid: message_uuid,
      },
    });
  }

  async all() {
    return this.messagesRepository.find();
  }
}
