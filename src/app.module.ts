import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { MessagesModule } from './messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { ChatsModule } from './chats/chats.module';
import databaseGlobal from './global/database.global';

@Module({
  imports: [
    ...databaseGlobal,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GatewayModule,
    MessagesModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
