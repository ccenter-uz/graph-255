import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator';
import { RolesEnum } from '../../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const methodName = this.canActivate.name;
    try {
      const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      console.log(requiredRoles);

      if (!requiredRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.debug(`Method: ${methodName} - Error: `, 'Not token');
        throw new ForbiddenException('Not token');
      }

      const user = this.jwtService.verify(token);
      request.userId = user?.id;
      const resultRole = requiredRoles.some((role) => user.role?.includes(role))

      if(!resultRole) {
        this.logger.debug(`Method: ${methodName} - Error: `, 'Role Erorr');
        throw new ForbiddenException('Must be role - ' + resultRole  + requiredRoles  );
      }
      console.log(requiredRoles.some((role) => user.role?.includes(role)));
      
      return requiredRoles.some((role) => user.role?.includes(role));
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new ForbiddenException('Invalid token');
    }
  }
}
