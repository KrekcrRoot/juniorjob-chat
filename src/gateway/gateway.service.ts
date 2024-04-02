import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from './dto/jwt.dto';
import { ConnectInterface } from './dto/connect-interface.dto';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class GatewayService {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatsService,
  ) {}

  verify(client: Socket) {
    try {
      this.jwtService.verify(client.handshake.headers.authorization);
      return true;
    } catch (e) {
      client.emit('debug', {
        error: 'JWT not valid',
      });
      client.disconnect(true);
      return false;
    }
  }

  decode_token(client: Socket) {
    return this.jwtService.decode(
      client.handshake.headers.authorization,
    ) as JwtToken;
  }

  check_validation(query: ConnectInterface, token: JwtToken) {
    const exists =
      token['uuid'] != undefined && query['user_uuid'] != undefined;
    if (!exists) return false;

    return token.uuid.trim().length != 0 && query.user_uuid.trim().length != 0;
  }

  get_credentials(client: Socket) {
    const query = client.handshake.query as unknown as ConnectInterface;
    const token = this.decode_token(client);

    const validation = this.check_validation(query, token);

    if (!validation) return false;

    query.user_uuid = query.user_uuid.trim();
    token.uuid = token.uuid.trim();

    return {
      query: query,
      token: token,
    };
  }

  async link_chat(client: Socket, token: JwtToken, query: ConnectInterface) {
    const chat = await this.chatService.findChatByUser(
      token.uuid,
      query.user_uuid,
    );

    if (!chat) {
      client.emit('debug', {
        error: 'Chat not exist or not valid',
      });
      client.disconnect(true);
      return;
    }

    client.join(chat.uuid);
    client.data.uuid = token.uuid;
  }
}
