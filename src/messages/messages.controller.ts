import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UUID } from '../global/dto.global';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Message } from './message.entity';
import { TokenRequest } from '../chats/chats.controller';
import { AccessTokenGuard } from '../common/guards/token.guard';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: Message,
    isArray: true,
    description: 'Return all messages (ONLY FOR TEST)',
  })
  @ApiOperation({ summary: 'Return all messages (ONLY FOR TEST)' })
  @Get('/all')
  all() {
    return this.messagesService.all();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Message,
    description: 'Return all metadata message by uuid',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return all metadata message by uuid' })
  @UseGuards(AccessTokenGuard)
  @Get('/:uuid')
  async uuid(@Param() params: UUID, @Req() tokenRequest: TokenRequest) {
    if (
      !(await this.messagesService.checkAccess(
        tokenRequest.user.uuid,
        params.uuid,
      ))
    ) {
      throw new BadRequestException("You don't have access to message");
    }
    return this.messagesService.uuid(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Message,
    description: 'Delete message by uuid (if you creator)',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete message by uuid' })
  @UseGuards(AccessTokenGuard)
  @Delete('/:uuid')
  async delete(@Param() params: UUID, @Req() tokenRequest: TokenRequest) {
    if (
      !(await this.messagesService.checkAuthor(
        tokenRequest.user.uuid,
        params.uuid,
      ))
    ) {
      throw new BadRequestException('You are not author of message');
    }
    return this.messagesService.delete(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Message,
    description: 'Read message (if you companion)',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete message by uuid' })
  @UseGuards(AccessTokenGuard)
  @Post('/read/:uuid')
  async read(@Param() params: UUID, @Req() tokenRequest: TokenRequest) {
    if (
      !(await this.messagesService.checkCompanion(
        tokenRequest.user.uuid,
        params.uuid,
      ))
    ) {
      throw new BadRequestException('You are not companion of message');
    }
    return this.messagesService.read(params.uuid);
  }
}
