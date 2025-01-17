import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create_application.dto';
import { UpdateApplicationDto } from './dto/update_application.dto';
import { jwtGuard } from '../auth/guards/jwt.guard';
import { GetApplicationDto } from './dto/get_application.dto';
import { CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from '../auth/guards/roles.decorator';
import { SheetApplicationDto } from './dto/sheet_application.dto';

@Controller('Application')
@ApiTags('Application')
@ApiBearerAuth('JWT-auth')
export class ApplicationController {
  readonly #_service: ApplicationService;
  constructor(service: ApplicationService) {
    this.#_service = service;
  }
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/all')
  @ApiOperation({
    description:
      'Operatorni barcha qoldirgan Arizalarini olish uchun , Token bilan, Requested_date orqali filter qilish mumkin',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Req() req: CustomRequest, @Query() query: GetApplicationDto) {
    return await this.#_service.findAll(req, query);
  }

  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/one/:id')
  @ApiOperation({ description: 'Token bilan' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string) {
    return await this.#_service.findOne(id);
  }

  // @UseGuards(jwtGuard)
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Grafik uchun ariza yaratish , Token bilan' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async create(
    @Req() req: CustomRequest,
    @Body() createProductDto: CreateApplicationDto,
  ) {
    return await this.#_service.create(req, createProductDto);
  }

  // @UseGuards(jwtGuard)
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Patch('/update/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: UpdateApplicationDto })
  @ApiOperation({
    description: 'Grafik uchun qoldirilgan arizani yangilash, Token bilan ',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateApplicationDto,
  ) {
    await this.#_service.update(id, updateProductDto);
  }

  // @UseGuards(jwtGuard)
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'FRONCHILAR TEGMASIN !!!!!',
    description: "Qoldirilgan Arizani o'chirish uchun",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.delete(id);
  }

  // @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Delete('/delete-month/:yearmonth')
  @ApiOperation({
    summary: 'FRONCHILAR TEGMASIN !!!!!',
    description: "Qoldirilgan Arizani o'chirish uchun",
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMonthApplication(@Param('yearmonth') yearMonth: string): Promise<void> {
    await this.#_service.deleteMonth(yearMonth);
  }

  // @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/forsheet')
  @ApiOperation({
    summary: 'FRONCHILAR TEGMASIN !!!!!',
    description: 'Barcha qoldirilgan Arizalarni Olish uchun',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getApplicationForSheets(@Query() query: SheetApplicationDto) {
    return await this.#_service.getApplicationForSheets(query);
  }
}
