import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UUID } from '../global/dto.global';
import { AccessTokenGuard } from '../common/guards/token.guard';

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

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get('/:uuid')
  uuid(@Param() params: UUID) {
    return this.chatsService.uuid(params.uuid);
  }

  @Get('/dialog/:uuid')
  messages(@Param() params: UUID) {
    return this.chatsService.messages(params.uuid);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/with/:uuid')
  with(@Param() params: UUID, @Req() request: TokenRequest) {
    return this.chatsService.with(request.user.uuid, params.uuid);
  }
}
