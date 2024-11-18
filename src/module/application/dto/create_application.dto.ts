import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsArray,
  } from 'class-validator';

  export class CreateApplicationDto { 
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    workingHours: string;
  
    @ApiProperty({example:['mon' , 'fri']})
    @IsArray()
    @IsNotEmpty()
    offDays: string[];
  
    @ApiProperty({example:[{
      id: 1,
      isWorkDay: true,
      isOrder: true,
      isNight: true,
      isHoliday: true,
      isToday: true,
      isCheckable: true,
      label: true,
    }]})
    
    @IsArray()
    @IsNotEmpty()
    daysOfMonth: Object[];
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    agentId: string;
  }