import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray
} from 'class-validator';

export class UpdateApplicationDto { 
  @ApiProperty()
  @IsString()
  workingHours: string;

  @ApiProperty({example:['mon' , 'fri']})
  @IsArray()
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
  daysOfMonth: Object[];
  @ApiProperty()
  @IsString()
  
  description: string;

  @ApiProperty()
  @IsString()
  agentId: string;
}