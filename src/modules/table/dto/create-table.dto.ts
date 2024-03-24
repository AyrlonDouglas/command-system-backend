import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 'Mesa 1', description: "Table's name" })
  @IsString()
  name: string;
}
