import { Module } from '@nestjs/common';
import { WsGateway } from './gateway';
import { ChatsModule } from '../chats/chats.module';
import { JwtGlobal } from '../global/jwt-global';
import { GatewayService } from './gateway.service';
import { GatewayMessagesService } from './gateway-messages.service';

@Module({
  providers: [WsGateway, GatewayService, GatewayMessagesService],
  imports: [ChatsModule, JwtGlobal],
})
export class GatewayModule {}
