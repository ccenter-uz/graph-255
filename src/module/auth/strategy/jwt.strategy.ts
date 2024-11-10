import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ControlUsersEntity } from 'src/entities/control_users.entity';
import { UsersEntity } from 'src/entities/users.entity';
import { CustomRequest } from 'src/types';

export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
      PassReqToCallback: true,
      pass: true,
    });
  }

  async validate(req: CustomRequest, payload: any) {
    console.log(payload);

    return { id: payload.id, roles: payload.role, password: payload.password };
    // const findUser = await UsersEntity.findOne({
    //   where: {
    //     id: payload.id,
    //     role: payload.role,
    //   },
    // });

    // if (findUser.role == 'operator') {
    //   throw new HttpException('You are not moderator', HttpStatus.NOT_FOUND);
    // }

    // return '1';
  }
}
