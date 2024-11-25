import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: 'SRV422',
  })
  @IsString()
  @MaxLength(200)
  login: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: '452270',
  })
  @IsString()
  @MaxLength(200)
  password: string;
}

