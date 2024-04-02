import { BadRequestException, Injectable } from '@nestjs/common';
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

  async delete(message_uuid: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        banned: false,
        uuid: message_uuid,
      },
    });

    if (!message) {
      throw new BadRequestException("Message doesn't exist");
    }

    return this.messagesRepository.softDelete(message.uuid);
  }

  async checkAuthor(author_uuid: string, message_uuid: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        uuid: message_uuid,
        banned: false,
      },
    });

    if (!message) {
      throw new BadRequestException("Message doesn't exist");
    }

    return message.user == author_uuid;
  }

  async checkAccess(user_uuid: string, message_uuid: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        uuid: message_uuid,
        banned: false,
      },
      relations: {
        chat: true,
      },
    });

    if (!message) {
      throw new BadRequestException("Message doesn't exist");
    }

    if (message.user == user_uuid) return true;

    return (
      message.chat.first_user == user_uuid ||
      message.chat.second_user == user_uuid
    );
  }

  async checkCompanion(user_uuid: string, message_uuid: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        uuid: message_uuid,
        banned: false,
      },
      relations: {
        chat: true,
      },
    });

    if (!message) {
      throw new BadRequestException("Message doesn't exist");
    }

    if (message.user == user_uuid) return false;

    return (
      message.chat.first_user == user_uuid ||
      message.chat.second_user == user_uuid
    );
  }

  async read(message_uuid: string) {
    const message = await this.messagesRepository.findOne({
      where: {
        banned: false,
        uuid: message_uuid,
      },
    });

    if (!message) {
      throw new BadRequestException("Message doesn't exist");
    }

    if (message.read) throw new BadRequestException('Message already read');

    message.read = true;
    return this.messagesRepository.save(message);
  }
}
