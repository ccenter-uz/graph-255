import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthServise } from '../auth.service';
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthServise) {
    super();
  }

  // validate(req: Request): string {
  //   // const user = d.find(e => e.username == username && e.password == password)

  //   // if(user) {
  //   //     throw new UnauthorizedException('User found')
  //   // }

  //   return 'ok';
  // }

  async validate(id: string, password: string): Promise<any> {
    console.log('okkk', id, password);

    const user = await this.authService.validateUser(id, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
