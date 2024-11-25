import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create_application.dto';
import { UpdateApplicationDto } from './dto/update_application.dto';

import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { ApplicationEntity } from 'src/entities/applications.entity';
import { GetApplicationDto } from './dto/get_application.dto';
import { AgentsDateEntity } from 'src/entities/agentsdata.entity';
import { CustomRequest } from 'src/types';
import { SheetApplicationDto } from './dto/sheet_application.dto';

@Injectable()
export class ApplicationService {
  private logger = new Logger(ApplicationService.name);

  async findAll(req: CustomRequest, query: GetApplicationDto) {
    const methodName = this.findAll;
    try {
      const { userId } = req;
      const { pageNumber, pageSize } = query;
      const offset = (pageNumber - 1) * pageSize;
      const findAgent = await AgentsDateEntity.findOne({
        where: {
          agent_id: userId,
        },
      });
      if (!findAgent) {
        this.logger.debug(
          `Method: ${methodName} - User not found: `,
          findAgent,
        );
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const [results, total] = await ApplicationEntity.findAndCount({
        where: {
          agent_id: findAgent.agent_id as any,
          requested_date: query.requested_date,
        },
        relations: {
          agent_id: true,
        },
        order: {
          create_data: 'DESC',
        },
        skip: offset,
        take: pageSize,
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

  async findOne(id: string, query: GetApplicationDto) {
    const methodName = this.findOne.name;
    const { requested_date } = query
    try {
      const findApplication = await ApplicationEntity.findOne({
        where: { 
          id,
          requested_date: requested_date =='null' ? "null": requested_date,
        },
        relations: {
          agent_id: true,
        },
      });

      if (!findApplication) {
        this.logger.debug(
          `Method: ${methodName} - Application Not Found: `,
          findApplication,
        );
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

  async create(req: CustomRequest, body: CreateApplicationDto) {
    const methodName = this.create;

    try {
      const { userId } = req;
      const findAgent = await AgentsDateEntity.findOne({
        where: {
          agent_id: userId,
        },
      });

      if (!findAgent) {
        this.logger.debug(
          `Method: ${methodName} - User not found: `,
          findAgent,
        );
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const createApplication: InsertResult =
        await ApplicationEntity.createQueryBuilder()
          .insert()
          .into(ApplicationEntity)
          .values({
            workingHours: body.workingHours,
            offDays: body.offDays,
            daysOfMonth: body.daysOfMonth,
            description: body.description,
            requested_date: body.requested_date,
            agent_id: {
              agent_id: userId,
            },
          })
          .execute();

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
      console.log(error, 'Error Message');
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, body: UpdateApplicationDto) {
    const methodName = this.update.name;
    try {
      const findApplication = await ApplicationEntity.findOne({
        where: { id },
        relations: { agent_id: true },
      });

      if (!findApplication) {
        this.logger.debug(
          `Method: ${methodName} - Application Not Found: `,
          findApplication,
        );
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      const updatedApplication: UpdateResult =
        await ApplicationEntity.createQueryBuilder()
          .update(ApplicationEntity)
          .set({
            workingHours: body.workingHours ?? findApplication.workingHours,
            offDays: body.offDays ?? findApplication.offDays,
            daysOfMonth: body.daysOfMonth ?? findApplication.daysOfMonth,
            description: body.description ?? findApplication.description,
            requested_date:
              body.requested_date ?? findApplication.requested_date,
          })
          .where('id = :id', { id })
          .execute();

      if (!updatedApplication.affected) {
        this.logger.debug(
          `Method: ${methodName} - Error Updating Application: `,
          updatedApplication,
        );
        throw new HttpException(
          'Update error in Application',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Application updated successfully',
        updatedApplication,
      };
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
      const findApplication = await ApplicationEntity.findOneBy({ id });

      if (!findApplication) {
        this.logger.debug(
          `Method: ${methodName} - Application Not Found: `,
          findApplication,
        );
        throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
      }

      const deleteApplication: DeleteResult = await ApplicationEntity.delete({
        id,
      });
      if (!deleteApplication.affected) {
        this.logger.debug(
          `Method: ${methodName} - Erorr Delete Application: `,
          deleteApplication,
        );
        throw new HttpException(
          'delete Erorr in Application',
          HttpStatus.BAD_REQUEST,
        );
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

  async getApplicationForSheets(query: SheetApplicationDto) {
    const findAgent = await ApplicationEntity.findOne({
      where: {
        requested_date : query.requested_date
      },
    });
  
    if (!findAgent) {
      throw new Error('Agent not found');
    }
    
    let daysOfMonth = []
    for(let day of findAgent.daysOfMonth ){
      daysOfMonth.push({
        id: day.id,
        isWorkDay: day.isWorkDay,
        isNight: day.isNight,
        label: day.label,
      })
    }
    const transformedData = {
      workingHours: findAgent.workingHours,
      offDays: findAgent.offDays,
      daysOfMonth:daysOfMonth,
      description: findAgent.description,
    };
    
    return transformedData;
  }
  
}
