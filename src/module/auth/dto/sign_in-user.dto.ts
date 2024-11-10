import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SingInUserDto {
  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: '+998933843484',
  })
  @IsString()
  @MaxLength(200)
  login: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone',
    example: '1234',
  })
  @IsString()
  @MaxLength(200)
  password: string;
}

