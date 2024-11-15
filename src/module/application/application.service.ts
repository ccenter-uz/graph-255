import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEntity } from 'src/entities/applications.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
  ) {}

  findAll() {
    return this.applicationRepository.find();
  }

  findOne(id: string) {
    return this.applicationRepository.findOne({ where: { id } });
  }

  create(applicationData: Partial<ApplicationEntity>) {
    const application = this.applicationRepository.create(applicationData);
    return this.applicationRepository.save(application);
  }

  update(id: string, applicationData: Partial<ApplicationEntity>) {
    return this.applicationRepository.update(id, applicationData);
  }

  delete(id: string) {
    return this.applicationRepository.delete(id);
  }
}
