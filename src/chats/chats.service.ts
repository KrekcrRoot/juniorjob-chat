import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../global/user.headers';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { isUUID } from 'class-validator';
import { Message } from '../messages/message.entity';
import { MessageSend } from '../messages/message.socket';
import { FiltersDto } from './dto/filters.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(User, 'main') private usersRepository: Repository<User>,
    @InjectRepository(Chat, 'chat') private chatsRepository: Repository<Chat>,
    @InjectRepository(Message, 'chat')
    private messagesRepository: Repository<Message>,
  ) {}

  async uuid(chat_uuid: string) {
    return this.chatsRepository.findOne({
      where: {
        uuid: chat_uuid,
        banned: false,
      },
    });
  }

  async findChat(first_user_uuid: string, second_user_uuid: string) {
    if (first_user_uuid == second_user_uuid) {
      throw new BadRequestException("You can't chat with yourself");
    }

    return this.chatsRepository.findOne({
      where: [
        {
          first_user: first_user_uuid,
          second_user: second_user_uuid,
          banned: false,
        },
        {
          first_user: second_user_uuid,
          second_user: first_user_uuid,
          banned: false,
        },
      ],
    });
  }

  async messages(uuid: string, filters: FiltersDto) {
    let page = 0,
      row = 100;

    if (filters.page !== undefined) page = filters.page;
    if (filters.row !== undefined) row = filters.row;

    return this.messagesRepository.find({
      skip: page * row,
      take: row,
      where: {
        chat: {
          uuid: uuid,
        },
        banned: false,
      },
      relations: {
        replied: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async with(first_uuid: string, second_uuid: string) {
    const chat = await this.findChat(first_uuid, second_uuid);

    if (!chat) {
      const initChat = this.chatsRepository.create({
        first_user: first_uuid,
        second_user: second_uuid,
      });

      return this.chatsRepository.save(initChat);
    }

    return chat;
  }

  async sendMessage(messageDto: MessageSend) {
    const chat = await this.chatsRepository.findOne({
      where: {
        uuid: messageDto.room_uuid,
        banned: false,
      },
    });

    if (!chat) {
      return false;
    }

    const message = this.messagesRepository.create({
      content: messageDto.body,
      user: messageDto.from_uuid,
      chat: chat,
    });

    if (messageDto.reply) {
      const replied_message = await this.messagesRepository.findOne({
        where: {
          uuid: messageDto.reply,
          chat: {
            uuid: chat.uuid,
          },
          banned: false,
        },
      });

      if (!replied_message) {
        return false;
      }

      message.replied = replied_message;
    }

    return this.messagesRepository.save(message);
  }

  async findChatByUser(first_user_uuid: string, second_user_uuid: string) {
    if (
      !isUUID(first_user_uuid) ||
      !isUUID(second_user_uuid) ||
      first_user_uuid == second_user_uuid
    ) {
      return false;
    }

    const partner = await this.usersRepository.findOne({
      where: {
        uuid: second_user_uuid,
        banned: false,
        deleted: false,
      },
    });

    if (!partner) {
      return false;
    }

    const chat = await this.findChat(first_user_uuid, second_user_uuid);

    if (!chat) {
      const initChat = this.chatsRepository.create({
        first_user: first_user_uuid,
        second_user: second_user_uuid,
      });

      return this.chatsRepository.save(initChat);
    }

    return chat;
  }

  async checkAccess(user_uuid: string, chat_uuid: string) {
    const chat = await this.chatsRepository.findOne({
      where: {
        uuid: chat_uuid,
        banned: false,
      },
    });

    if (!chat) {
      throw new BadRequestException("This chat doesn't exist");
    }

    return chat.first_user == user_uuid || chat.second_user == user_uuid;
  }

  async allDialogsByUser(user_uuid: string) {
    return this.chatsRepository.find({
      where: [
        {
          first_user: user_uuid,
        },
        {
          second_user: user_uuid,
        },
      ],
    });
  }
}
