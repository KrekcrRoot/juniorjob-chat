import { Module } from '@nestjs/common';
import { WsGateway } from './gateway';
import { ChatsModule } from '../chats/chats.module';
import { JwtGlobal } from '../global/jwt-global';

@Module({
  providers: [WsGateway],
  imports: [ChatsModule, JwtGlobal],
})
export class GatewayModule {}
