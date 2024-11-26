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
  @ApiOperation({
    description:
      'KIRITILINGAN OYDAGI OPEARTORNI GRAFIGINI OLISH UCHUN, Token bilan, FORMAT :XXXX/YY',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneAgent(
    @Req() req: CustomRequest,
    @Query() query: GetOperatorDto,
  ) {
    return await this.#_service.findOneAgent(req, query);
  }

  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('get-all-month')
  @ApiOperation({ description: 'Bitta Operatorni grafigi bor oylari , Token bilan' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getAllMonth(@Req() req: CustomRequest) {
    return await this.#_service.getAllMonth(req);
  }

  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('data-months')
  @ApiOperation({
    description:
      'OHIRGI OY MALUMOTINI OLISH UCHUN ,  Kerakli oy  malumotlarni olish uchun  Format :XXXX/YY , Token bilan',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOneAgentDataMonths(
    @Req() req: CustomRequest,
    @Query() query: GetOperatorDto,
  ) {
    return await this.#_service.findOneAgentDataMonths(req, query);
  }

  @Get('get-holiday-via-id')
  @ApiOperation({
    description:
      'BAYRAM KUNLARINI OLISH UCHUN ,  Kerakli oy  malumotlarni olish uchun  Format  : YY',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getHolidayViaId(@Query('month_id') month_id: string) {
    return await this.#_service.getHolidayViaId(month_id);
  }

  // @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('get-office-branches')
  @ApiOperation({
    description: "Barcha Smena bo'yicha xizmatlarni olish uchun ",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getOfficeBranches() {
    return await this.#_service.getOfficeBranches();
  }

  @Get('get-supervisors')
  @ApiOperation({
    description:
      "Superviserlar ro'yxatini xizmat raqamini kiritish orqali olish misol: 1009, 255, 229",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getSupervisor(@Query('type') type: string) {
    return await this.#_service.getSupervisor(type);
  }

  @Get('one')
  @ApiOperation({
    summary: 'FRONTCHILAR  TEGMASIN!!!!',
    description: "Operator ma'lumotini login orqali qaytarish ",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Query('login') login: string) {
    return await this.#_service.operatorForLogin(login);
  }

  @Get('writeNewGraph-or-update')
  @ApiOperation({
    summary: 'FRONTCHILAR  TEGMASIN!!!!',
    description:
      'Frontchilar  tegmasin!!!! Sheets dan DBga graphic tortish yoki yangilash',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeNewGraph() {
    return await this.#_service.writeNewGraph();
  }

  @Get('write-super-visors')
  @ApiOperation({
    summary: 'FRONTCHILAR  TEGMASIN!!!!',
    description: "Frontchilar  tegmasin!!!! Superviserlar ro'yxatini yangilash",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeSuperVisors() {
    return await this.#_service.writeSuperVisors();
  }

  @Get('write-holidays')
  @ApiOperation({
    summary: 'FRONTCHILAR  TEGMASIN!!!!',
    description: 'Frontchilar  tegmasin!!!!  Bayram kunlarini yangilash',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async writeHolidays() {
    return await this.#_service.writeHolidays();
  }
}
