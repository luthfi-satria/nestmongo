import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../interface/user.interface';
import { TokenExpiredError } from 'jsonwebtoken';
import { ResponseService } from '../../../response/response.service';
import { MessageService } from '../../../message/message.service';
import { RMessage } from '../../../response/response.interface';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private reflector: Reflector,
  ) {
    super();
  }

  private user_type_and_levels: string[];
  private permission: string[];

  canActivate(context: ExecutionContext) {
    this.user_type_and_levels =
      this.reflector.get<string[]>(
        'user_type_and_levels',
        context.getHandler(),
      ) ?? [];

    const user_types =
      this.reflector.get<string[]>('user_types', context.getHandler()) ?? [];
    user_types.forEach((element) => {
      this.user_type_and_levels.push(element + '.*');
    });
    this.permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: Error) {
    const logger = new Logger();
    if (err) {
      throw new InternalServerErrorException(err);
    }
    const loggedInUser: User = user;
    if (!loggedInUser) {
      let error_message = ['Invalid token'];
      if (info instanceof TokenExpiredError) {
        error_message = ['token expired'];
      }

      logger.error('AuthJwtGuardError.Unauthorize');
      const errors: RMessage = {
        value: '',
        property: 'token',
        constraint: error_message,
      };
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          errors,
          'Unauthorize',
        ),
      );
    }

    if (
      this.user_type_and_levels &&
      !this.user_type_and_levels.includes(loggedInUser.user_type + '.*') &&
      !this.user_type_and_levels.includes(
        loggedInUser.user_type + '.' + loggedInUser.level,
      )
    ) {
      logger.error('AuthJwtGuardError.Forbidden');
      const errors: RMessage = {
        value: '',
        property: 'token',
        constraint: [this.messageService.get('auth.token.forbidden')],
      };
      throw new ForbiddenException(
        this.responseService.error(
          HttpStatus.FORBIDDEN,
          errors,
          'Forbidden Access',
        ),
      );
    }
    return user;
  }
}
