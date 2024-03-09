import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
import { UUID } from '../global/dto.global';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) {}

  @Get('/all')
  all() {
    return this.messagesService.all();
  }

  @Get('/author/:uuid')
  async author(@Param() params: UUID) {
    console.log(await this.jwtService.signAsync({ somePayload: 'test' }));
    // this.messagesService.findUser(params.uuid);
  }

  @Get('/:uuid')
  async uuid(@Param() params: UUID) {
    return this.messagesService.uuid(params.uuid);
  }
}
