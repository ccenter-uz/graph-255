import {  CacheModuleOptions, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { connectDb } from './config/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegrafModule } from 'nestjs-telegraf';
import { AgentsModule } from './module/agents/agents.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './module/auth/auth.module';
import { RolesGuard } from './module/auth/guards/roles.guard';
// import { CategoryInfoModule } from './module/categories_Info/users.module';
// import { SoapModule } from './module/soap/soap.module';

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    ScheduleModule.forRoot(),
    // TelegrafModule.forRoot({
    //   token: '5994786340:AAHQOpj10D8Bi0XhgQpYD14hDoHogp3Q0z8',
    // }),
    // TelegrafModule.forRoot({
    //   token: process.env.BOT_TOKEN ,
    // }),

    AgentsModule,
    AuthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheModuleOptions => ({
        ttl: 3600000,
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
