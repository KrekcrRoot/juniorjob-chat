import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { MessageNew, MessageSocket } from '../messages/message.socket';
import * as process from 'process';
import { config } from 'dotenv';
import { GatewayService } from './gateway.service';
import { GatewayMessagesService } from './gateway-messages.service';

config();
const WS_PORT = Number(process.env.WEBSOCKET_PORT) || 443;

@WebSocketGateway(WS_PORT, {
  cors: {
    origin: true,
  },
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatService: ChatsService,
    private gatewayService: GatewayService,
    private messagesService: GatewayMessagesService,
  ) {}

  @SubscribeMessage('message')
  async message(client: Socket, args: MessageNew) {
    const valid = this.messagesService.valid_message(client, args);
    if (!valid) return;

    const messageDbDto = this.messagesService.generate_message(client, args);
    const message = await this.chatService.sendMessage(messageDbDto);

    if (!message) {
      client.emit('debug', { error: 'Server internal. Message not sent' });
      return;
    }

    const msgSocket: MessageSocket = {
      uuid: message.uuid,
      body: message.content,
      time: +new Date(message.created_at),
      replied: null,
    };

    if (args.reply) msgSocket.replied = args.reply;

    client.rooms.forEach((el) => {
      client.to(el).emit('incoming', msgSocket);
    });
  }

  async handleConnection(client: Socket) {
    // Verifying
    const verify_result = this.gatewayService.verify(client);
    if (!verify_result) return;

    // Get query
    const credentials = this.gatewayService.get_credentials(client);
    if (!credentials) {
      client.emit('debug', {
        error: 'Bad gateway param (user_uuid or jwt token auth)',
      });
      client.disconnect(true);
      return;
    }
    const query = credentials.query;
    const token = credentials.token;

    // Link user to chat (if exist)
    await this.gatewayService.link_chat(client, token, query);
  }
}
