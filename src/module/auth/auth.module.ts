import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { jwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthServise } from './auth.service';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      global: true,
      signOptions: { expiresIn: '43200s' },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, jwtStrategy, AuthServise],
})
export class AuthModule {}
