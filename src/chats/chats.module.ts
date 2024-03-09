import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { chatConnection, mainConnection } from '../global/database.global';
import { ChatsController } from './chats.controller';
import { AccessTokenStrategy } from '../common/strategies/token.strategy';

@Module({
  imports: [chatConnection, mainConnection],
  providers: [ChatsService, AccessTokenStrategy],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
