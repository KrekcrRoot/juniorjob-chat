import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FiltersDto {
  @ApiProperty({
    required: false,
    example: '0',
    description: 'Page number',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
    example: '100',
    description: 'Messages in one page',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  row: number | null;
}
