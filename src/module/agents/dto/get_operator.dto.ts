import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOperatorDto {

  @ApiProperty({ required: false, example: '2024/11' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  year_and_month?: string = 'null';
}
