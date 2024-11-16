import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsBoolean,
    IsDateString,
  } from 'class-validator';

  export class CreateApplicationDto {
    @IsString()
    @IsNotEmpty()
    id: string;
  
    @IsString()
    @IsNotEmpty()
    workingHours: string;
  
    @IsString()
    @IsNotEmpty()
    offDays: string;
  
    @IsString()
    @IsNotEmpty()
    daysOfMonth: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsString()
    @IsNotEmpty()
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
      id: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: 'string',
      })
      @IsString()
      @IsNotEmpty()
      workingHours: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: true,
      })
      @IsBoolean()
      @IsNotEmpty()
      offDays: string;
    
      @ApiProperty({
        type: 'string',
        required: true,
        example: 'test',
      })
      @IsString()
      @IsNotEmpty()
      daysOfMonth: string;
    
      @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
        example: 'test',
      })
      @IsDateString()
      @IsNotEmpty()
      description: string;
    
      @ApiProperty({
        type: 'string',
        format: 'date',
        required: true,
        example: 'test',
      })
      @IsDateString()
      @IsNotEmpty()
      agentIdAgentId: string;
  }