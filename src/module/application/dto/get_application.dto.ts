import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetApplicationDto {
  @ApiProperty({ required: false, example: '2024' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  year?: string;

  @ApiProperty({ required: false, example: '11' })
  @IsOptional()
  @Type(() => String)
  @IsString()
  month?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageNumber?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}