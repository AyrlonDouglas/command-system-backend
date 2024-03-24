import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'item-order quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1, description: 'item-order order id' })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 1, description: 'item-order item id' })
  @IsNumber()
  itemId: number;
}
