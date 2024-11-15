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
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { GetOperatorDto } from './dto/get_operator.dto';
import { CustomRequest } from 'src/types';

@Controller('agents')
@ApiTags('agents')
export class AgentsController {
  readonly #_service: AgentsService;
  constructor(service: AgentsService) {
    this.#_service = service;
  }

  @Get('one-with-graphic')
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
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneAgentDataMoths(
    @Req() req: CustomRequest,
  ) {
    return await this.#_service.findOneAgentDataMoths(req);
  }

  @Get('one')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Query('login') login: string) {
    return await this.#_service.operatorForLogin(login);
  }

  @Get('writeNewGraph-or-update')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeNewGraph() {
    return await this.#_service.writeNewGraph();
  }

  @Get('write-super-visors')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeSuperVisors() {
    return await this.#_service.writeSuperVisors();
  }

  @Get('write-holidays')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeHolidays() {
    return await this.#_service.writeHolidays();
  }

  @Get('get-supervisor-via-type')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getSupervisor(@Query('type') type: string) {
    return await this.#_service.getSupervisor(type);
  }

  @Get('get-holiday-via-id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getHolidayViaId(@Query('month_id') month_id: string) {
    return await this.#_service.getHolidayViaId(month_id);
  }
}
