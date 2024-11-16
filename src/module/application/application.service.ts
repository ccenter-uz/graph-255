import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create_application.dto';
import { UpdateApplicationDto } from './dto/update_application.dto';

import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ApplicationEntity } from 'src/entities/applications.entity';
import { GetApplicationDto } from './dto/get_application.dto';

@Injectable()
export class ApplicationService {
  private logger = new Logger(ApplicationService.name);

  async findAll(query : GetApplicationDto) {
    const methodName = this.findAll;
    
    try {
      const {pageNumber, pageSize} = query
      const offset = (pageNumber - 1) * pageSize;

      const [results, total] = await ApplicationEntity.findAndCount({
        relations: {
          id: true,
        },
        order: {
          create_data: 'desc',
        },
        skip: offset,
        take: pageSize,
      }).catch((e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      const totalPages = Math.ceil(total / pageSize);


      return {
        results,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          pageSize,
          totalItems: total,
        },
      };
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    const methodName = this.findOne.name;
    try {
      const findApplication = await ApplicationEntity.findOne({
        where :{ id },
        relations : {
          agent_id: true
        }
      }).catch((e) => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });
      if (!findApplication) {
        this.logger.debug(`Method: ${methodName} - Application Not Found: `, findApplication);
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }
      return findApplication;
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(body: CreateApplicationDto) {
    const methodName = this.create;
    try {
      const findAgent = await ApplicationEntity.findOne({
        where: {
          id: body.id,
        },
      }).catch(() => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      if (!findAgent) {
        this.logger.debug(`Method: ${methodName} - User not found: `, findAgent);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const createApplication: InsertResult = await ApplicationEntity.createQueryBuilder()
        .insert()
        .into(ApplicationEntity)
        .values({
          workingHours: body.workingHours,
          offDays: body.offDays,
          daysOfMonth: body.daysOfMonth,
          description: body.description,
          agent_id: findAgent,
        })
        .execute()
        .catch((e) => {
          throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        });

      if (!createApplication.raw[0].id) {
        this.logger.debug(
          `Method: ${methodName} - Erorr Insert Application: `,
          createApplication,
        );
        throw new HttpException(
          'insert Erorr in Product',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        message: 'create Application',
      };
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(id: string, body: UpdateApplicationDto) {
    const methodName = this.update;

    try {
      const findApplication = await ApplicationEntity.findOne({
        where: { id },
      });

      if (!findApplication) {
        this.logger.debug(`Method: ${methodName} - Application Not Found: `, findApplication);
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      let findAgent = findApplication?.id;

      if (body.id != 'null') {
        findAgent = await findApplication.findOne({
          where: {
            id: body.id,
          },
        });

        if (!findAgent) {
          this.logger.debug(
            `Method: ${methodName} - User Not Found: `,
            findAgent,
          );
          throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
      }

      const updatedApplication: UpdateResult = await findApplication.update(id, {
        workingHours: body.workingHours ?? findApplication.workingHours,
        offDays: body.offDays ?? findApplication.offDays,
        daysOfMonth: body.daysOfMonth ?? findApplication.daysOfMonth,
        description: body.description ?? findApplication.description,
      });
      if (!updatedApplication.affected) {
        this.logger.debug(
          `Method: ${methodName} - Erorr Update Application: `,
          updatedApplication,
        );
        throw new HttpException('update Erorr in Application', HttpStatus.BAD_REQUEST);
      }

      return updatedApplication;
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string) {
    const methodName = this.delete;

    try {
      const findApplication = await ApplicationEntity.findOneBy({ id }).catch(() => {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      });

      if (!findApplication) {
        this.logger.debug(`Method: ${methodName} - Application Not Found: `, findApplication);
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      const deleteApplication: DeleteResult = await ApplicationEntity.delete({ id });
      if (!deleteApplication.affected) {
        this.logger.debug(
          `Method: ${methodName} - Erorr Delete Application: `,
          deleteApplication,
        );
        throw new HttpException('delete Erorr in Application', HttpStatus.BAD_REQUEST);
      }
      return deleteApplication;
    } catch (error) {
      this.logger.debug(`Method: ${methodName} - Error: `, error);
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}