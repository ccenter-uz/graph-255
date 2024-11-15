import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationEntity } from 'src/entities/applications.entity';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(id);
  }

  @Post()
  create(@Body() applicationData: Partial<ApplicationEntity>) {
    return this.applicationService.create(applicationData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() applicationData: Partial<ApplicationEntity>) {
    return this.applicationService.update(id, applicationData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.applicationService.delete(id);
  }
}
