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
  ApiTags,
} from '@nestjs/swagger';
import { SingInUserDto } from './dto/sign_in-user.dto';
import { CustomRequest } from 'src/types';

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

  @Get('/one/')
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  async findOne(@Req() request: CustomRequest) {
    return await this.service.findOne(request);
  }

  // @RequiredRoles(RolesEnum.ADMIN)
  @Delete('/deleteUser/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async deleteControlUser(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
