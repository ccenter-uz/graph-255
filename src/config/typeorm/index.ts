import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersEntity } from 'src/entities/users.entity';
import { SupervisersEntity } from 'src/entities/supervisers.entity';
import { GraphMonthEntity } from 'src/entities/graphMoth';
import { GraphDaysEntity } from 'src/entities/graphDays';
import { HolidaysEntity } from 'src/entities/holidays.entity';
import { AgentsDateEntity } from 'src/entities/agentsdata.entity';

dotenv.config();

export const connectDb: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  password: String(process.env.DB_PASSWORD),
  username: process.env.DB_USERNAME,
  database: process.env.DATABASE,
  entities: [
    UsersEntity,
    AgentsDateEntity,
    SupervisersEntity,
    GraphMonthEntity,
    GraphDaysEntity,
    HolidaysEntity,
  ],
  autoLoadEntities: true,
  synchronize: true,
};
