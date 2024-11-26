import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { GetOperatorDto } from './dto/get_operator.dto';
import { CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from '../auth/guards/roles.decorator';

@Controller('agents')
@ApiTags('agents')
@ApiBearerAuth('JWT-auth')
export class AgentsController {
  readonly #_service: AgentsService;
  constructor(service: AgentsService) {
    this.#_service = service;
  }
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('one-with-graphic')
  @ApiOperation({ description: 'Yil va oy asosida operatorlar ro\'yxati' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneAgent(
    @Req() req: CustomRequest,
    @Query() query: GetOperatorDto,
  ) {
    return await this.#_service.findOneAgent(req, query);
  }

  @Get('one-data-months')
  @ApiOperation({ description: 'operator 1 ta oy' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneAgentDataMonths(@Req() req: CustomRequest) {
    return await this.#_service.findOneAgentDataMonths(req);
  }

  @Get('one')
  @ApiOperation({ description: 'Operator ma\'lumotini login orqali qaytarish  ' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Query('login') login: string) {
    return await this.#_service.operatorForLogin(login);
  }

  @Get('writeNewGraph-or-update')
  @ApiOperation({ description: 'Sheets dan DBga graphic tortish yoki yangilash' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeNewGraph() {
    return await this.#_service.writeNewGraph();
  }

  @Get('write-super-visors')
  @ApiOperation({ description: 'Superviserlar ro\'yxatini yangilash' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeSuperVisors() {
    return await this.#_service.writeSuperVisors();
  }

  @Get('write-holidays')
  @ApiOperation({ description: 'Bayram kunlarini yangilash' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeHolidays() {
    return await this.#_service.writeHolidays();
  }

  @Get('get-supervisor-via-type')
  @ApiOperation({ description: 'Superviserlar ro\'yxatini filial raqami orali chiqarish' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getSupervisor(@Query('type') type: string) {
    return await this.#_service.getSupervisor(type);
  }

  @Get('get-holiday-via-id')
  @ApiOperation({ description: 'Oy sanasi oraqli bayram kunlarini chiqarish' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getHolidayViaId(@Query('month_id') month_id: string) {
    return await this.#_service.getHolidayViaId(month_id);
  }
}
