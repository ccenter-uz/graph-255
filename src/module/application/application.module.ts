import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ApplicationEntity } from 'src/entities/applications.entity';

@Module({
//   imports: [TypeOrmModule.forFeature([ApplicationEntity])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
