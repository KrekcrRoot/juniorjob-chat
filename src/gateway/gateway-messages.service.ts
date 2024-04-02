import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageNew, MessageSend } from '../messages/message.socket';
import { isUUID } from 'class-validator';

@Injectable()
export class GatewayMessagesService {
  valid_message(client: Socket, args: MessageNew) {
    if (!args) {
      client.emit('debug', { error: 'Message JSON not valid' });
      return false;
    }

    if (!args.body) {
      client.emit('debug', { error: 'Bad message JSON payload' });
      return false;
    }

    if (args.reply && !isUUID(args.reply)) {
      client.emit('debug', { error: 'Reply key uuid is not valid' });
      return false;
    }

    return true;
  }

  generate_message(client: Socket, args: MessageNew) {
    const rooms = client.rooms.values();
    rooms.next();

    const message: MessageSend = {
      room_uuid: rooms.next().value,
      from_uuid: client.data.uuid,
      body: args.body,
      reply: null,
    };

    if (args.reply) message.reply = args.reply;

    return message;
  }
}
