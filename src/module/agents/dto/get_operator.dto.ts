import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOperatorDto {
  @ApiProperty({ required: false, example: 'SRV422' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  login?: string;

  @ApiProperty({ required: false, example: 'month_id' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  month_id?: string = 'null';
}
