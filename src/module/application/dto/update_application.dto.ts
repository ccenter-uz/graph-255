import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateApplicationDto {
  @IsString()
  id: string;

  @IsString()
  workingHours: string;

  @IsString()
  offDays: string;

  @IsString()
  daysOfMonth: string;

  @IsString()
  description: string;

  @IsString()
  agentIdAgentId: string;
}

export class UpdateApplicationSwaggerBodyDto {
  @ApiProperty({
    type: 'string',
    required: false,
    example: '55cc8c2d-34c1-4ca3-88e0-7b1295875642',
  })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '123000',
  })
  @IsString()
  @IsOptional()
  workingHours?: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  offDays?: boolean;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'yaxshi odamdir',
  })
  @IsString()
  @IsOptional()
  daysOfMonth?: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
    example: '2023-01-01',
  })
  @IsDateString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'date',
    required: false,
    example: '2023-01-01',
  })
  @IsDateString()
  @IsOptional()
  agentIdAgentId?: string;
}