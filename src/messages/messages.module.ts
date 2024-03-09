import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { JwtGlobal } from '../global/jwt-global';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message], 'chat'),
    JwtGlobal,
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
