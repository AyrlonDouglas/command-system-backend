import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export interface IItems {
  id: number;
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: [{ id: 1, quantity: 2 }],
    description: 'orders items id',
  })
  items: IItems[];

  @ApiProperty({ example: 1, description: 'Order command id' })
  @IsNumber()
  commandId: number;
}
