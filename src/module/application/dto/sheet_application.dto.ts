import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SheetApplicationDto {
    @ApiProperty({ required: true, example: '2024/11' })
    @IsOptional()
    @Type(() => String)
    @IsString()
    requested_date?: string;
}