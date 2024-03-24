import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'rice', description: 'item name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'delicious white rice with white sauce with cheese',
    description: 'item description',
  })
  description: string;

  @ApiProperty({ example: 15.9, description: 'item price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1, description: 'item category id' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: true,
    description: 'Item availability',
  })
  avaliable: boolean;
}
