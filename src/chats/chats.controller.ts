import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param, Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UUID } from '../global/dto.global';
import { AccessTokenGuard } from '../common/guards/token.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Chat } from './chat.entity';
import { Message } from '../messages/message.entity';
import { FiltersDto } from './dto/filters.dto';

export enum UserRole {
  Applicant = 'applicant',
  Individual = 'individual',
  LegalEntity = 'legal_entity',
  Moderator = 'moderator',
}

export class UserJwtDto {
  public uuid: string;
  public email: string;
  public role: UserRole;
}

export interface TokenRequest extends Request {
  user: UserJwtDto;
}

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: Chat,
    isArray: true,
    description: 'Return chat by uuid',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return your chats' })
  @Get('/my')
  @UseGuards(AccessTokenGuard)
  async my(@Req() tokenRequest: TokenRequest) {
    return this.chatsService.allDialogsByUser(tokenRequest.user.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Chat,
    description: 'Return chat by uuid',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return chat by uuid' })
  @UseGuards(AccessTokenGuard)
  @Get('/:uuid')
  async uuid(@Param() params: UUID, @Req() tokenRequest: TokenRequest) {
    if (
      !(await this.chatsService.checkAccess(
        tokenRequest.user.uuid,
        params.uuid,
      ))
    ) {
      throw new BadRequestException("You don't have access to this chat");
    }
    return this.chatsService.uuid(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Message,
    isArray: true,
    description: 'Return all messages by chat uuid',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return all messages by chat uuid' })
  @UseGuards(AccessTokenGuard)
  @Get('/dialog/:uuid')
  async messages(
    @Param() params: UUID,
    @Req() tokenRequest: TokenRequest,
    @Query() query: FiltersDto,
  ) {
    if (
      !(await this.chatsService.checkAccess(
        tokenRequest.user.uuid,
        params.uuid,
      ))
    ) {
      throw new BadRequestException("You don't have access to this chat");
    }
    return this.chatsService.messages(params.uuid, query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Chat,
    description: 'Return chat by user (companion) uuid',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return chat by user (companion) uuid' })
  @UseGuards(AccessTokenGuard)
  @Get('/with/:uuid')
  with(@Param() params: UUID, @Req() request: TokenRequest) {
    return this.chatsService.with(request.user.uuid, params.uuid);
  }
}
