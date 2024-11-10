import {
  HttpException,
  HttpStatus,
  Injectable,
  Body,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { AgentsDateEntity } from 'src/entities/agentsdata.entity';
import { CustomRequest } from 'src/types';

@Injectable()
export class AuthServise {
  constructor(private readonly jwtServise: JwtService) {}
  private logger = new Logger(AuthServise.name);

  async signIn(signInDto: SingInUserDto) {
    const finduser = await AgentsDateEntity.findOne({
      where: {
        login: signInDto.login,
        password: signInDto.password,
      },
    }).catch((e) => {
      throw new HttpException('Bad Request ', HttpStatus.BAD_REQUEST);
    });

    if (!finduser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'successfully sing In',
      role: finduser.role,
      token: this.sign(finduser.agent_id, finduser.role, finduser.password),
    };
  }

  async findOne(req: CustomRequest ) {
    const finduser = await AgentsDateEntity.findOne({
      where: {
        agent_id: req.userId,
      },
    });

    if (!finduser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return finduser;
  }

  async delete(id: string) {
    const findUser = await AgentsDateEntity.findOne({
      where: {
        agent_id: id,
      },
    });

    if (!findUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const deleteUser = await AgentsDateEntity.delete({
      agent_id: findUser.agent_id,
    });

    return deleteUser;
  }

  async validateUser(id: string, pass: string): Promise<any> {
    const user = await AgentsDateEntity.findOne({
      where: { agent_id: id },
    });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  sign(id: string, role: string, password: string) {
    return this.jwtServise.sign({ id, role, password });
  }

  async verify(token: string) {
    const methodName = this.verify;
    try {
      const verifytoken = await this.jwtServise
        .verifyAsync(token)
        .catch((e) => {
          // throw new UnauthorizedException(e);
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });
      return verifytoken;
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
