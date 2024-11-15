import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsUUID,
    IsBoolean,
    IsDateString,
  } from 'class-validator';

  export class CreateApplicationDto {
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

  export class CreateApplicationSwaggerBodyDto {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'string',
      })
      @IsUUID()
      @IsNotEmpty()
      id?: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: 'string',
      })
      @IsString()
      @IsNotEmpty()
      workingHours?: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: true,
      })
      @IsBoolean()
      @IsNotEmpty()
      offDays?: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: 'test',
      })
      @IsString()
      @IsNotEmpty()
      daysOfMonth?: string;
    
      @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
        example: 'test',
      })
      @IsDateString()
      @IsNotEmpty()
      description?: string;
    
      @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
        example: 'test',
      })
      @IsDateString()
      @IsNotEmpty()
      agentIdAgentId?: string;
  }