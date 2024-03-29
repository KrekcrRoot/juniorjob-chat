import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { JwtService } from '@nestjs/jwt';
import { Chat } from '../chats/chat.entity';
import {
  MessageNew,
  MessageSend,
  MessageSocket,
} from '../messages/message.socket';
import * as process from 'process';
import { config } from 'dotenv';
import { Message } from '../messages/message.entity';

export interface ConnectInterface {
  user_uuid: string;
}

export interface JwtToken {
  uuid: string;
}

config();
const WS_PORT = Number(process.env.WEBSOCKET_PORT) || 443;

@WebSocketGateway(WS_PORT)
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatsService,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('message')
  async message(client: Socket, args: string) {
    let msgDto: MessageNew;
    try {
      msgDto = JSON.parse(args) as MessageNew;
    } catch (e) {
      client.emit('debug', { error: 'Message JSON not valid' });
      return;
    }
    if (!msgDto.body) {
      client.emit('debug', { error: 'Bad message JSON payload' });
      return;
    }

    const rooms = client.rooms.values();
    rooms.next();
    const messageSendDto: MessageSend = {
      room_uuid: rooms.next().value,
      from_uuid: client.data.uuid,
      body: msgDto.body,
    };

    const message = await this.chatService.sendMessage(messageSendDto);

    if (!message) return;

    const msgSocket: MessageSocket = {
      uuid: message.uuid,
      body: message.content,
      time: +new Date(message.created_at),
    };

    client.rooms.forEach((el) => {
      client.to(el).emit('incoming', msgSocket);
    });
  }

  async handleConnection(client: Socket) {
    try {
      this.jwtService.verify(client.handshake.headers.authorization);
    } catch (e) {
      client.disconnect(true);
    }
    const query = client.handshake.query as unknown as ConnectInterface;

    const token = this.jwtService.decode(
      client.handshake.headers.authorization,
    ) as JwtToken;

    if (!query.user_uuid || !token.uuid) {
      client.emit('debug', {
        error: 'Bad gateway param (user_uuid or jwt token auth)',
      });
      client.disconnect(true);
      return;
    }

    const chat = await this.chatService.findChatByUser(
      token.uuid,
      query.user_uuid,
    );

    if (!chat) {
      client.disconnect(true);
    }
    if (chat instanceof Chat) {
      client.join(chat.uuid);
      client.data.uuid = token.uuid;
    }
  }
}
