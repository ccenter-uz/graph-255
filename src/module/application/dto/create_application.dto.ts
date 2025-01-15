import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsOptional,
  } from 'class-validator';

  export class CreateApplicationDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    workingHours: string;

    @ApiProperty({ example: ['mon', 'fri'] })
    @IsOptional()
    @IsArray()
    offDays: string[];

    @ApiProperty({
      example: [
        {
          id: 1,
          isWorkDay: true,
          isOrder: true,
          isNight: true,
          isHoliday: true,
          isToday: true,
          isCheckable: true,
          label: true,
        },
      ],
    })
    @IsOptional()
    @IsArray()
    daysOfMonth: Object[];

    @ApiProperty()
    @IsOptional()
    @IsString()
    supervizorName: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ example: '2024/11' })
    @IsString()
    @IsNotEmpty()
    requested_date: string;
  }