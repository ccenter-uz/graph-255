import {
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Get,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthServise } from './auth.service';
import { Controller } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { CustomRequest, RolesEnum } from 'src/types';
import { RequiredRoles } from './guards/roles.decorator';

@Controller('Auth')
@ApiTags('Auth')
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly service: AuthServise) {}

  @Post('user/signIn')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: SingInUserDto })
  signIn(@Body() body: SingInUserDto) {
    return this.service.signIn(body);
  }
  @RequiredRoles(RolesEnum.OPERATOR, RolesEnum.ADMIN)
  @Get('/one/')
  @ApiOperation({
    description: 'Operator malumotlarini olish uchun, Token bilan',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Req() request: CustomRequest) {
    return await this.service.findOne(request);
  }

  @Delete('/deleteUser/:id')
  @ApiOperation({
    summary: 'FRONCHILAR TEGMASIN !!!!!',
    description: 'Operatorni ochirish uchun',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async deleteControlUser(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
