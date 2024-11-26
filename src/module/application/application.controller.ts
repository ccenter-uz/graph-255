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
  @ApiOperation({ description: 'Create Product with role' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findall(@Req() req: CustomRequest, @Query() query: GetApplicationDto) {
    return await this.#_service.findAll(req, query);
  }
  
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/one/:id')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Param('id') id: string, @Query() query: GetApplicationDto) {
    return await this.#_service.findOne(id, query);
  }

  // @UseGuards(jwtGuard)
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Create Product with role' })
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
  @ApiOperation({ summary: 'Update with role' })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id') id: string): Promise<void> {
    await this.#_service.delete(id);
  }

  // @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/forsheet')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async getApplicationForSheets( @Query() query: GetApplicationDto) {
    return await this.#_service.getApplicationForSheets( query);
  }
}
