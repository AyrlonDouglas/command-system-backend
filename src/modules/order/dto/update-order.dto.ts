import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrderStatusEnum } from 'src/helper/enum/orders';
import { OrderStatusType } from 'src/helper/interfaces/orders';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.CONFIRMED,
    description: 'Order status',
  })
  @IsString()
  status: OrderStatusType;
}
