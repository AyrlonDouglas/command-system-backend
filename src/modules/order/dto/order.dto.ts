import { OrderStatusType } from 'src/helper/interfaces/orders';
import { CommandDto } from 'src/modules/command/dto/command.dto';
// import { Command } from 'src/modules/command/entities/command.entity';
import { OrderItemDto } from 'src/modules/order-item/dto/order-item.dto';
// import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Order } from '../entities/order.entity';

export class OrderDto {
  readonly id: number;

  readonly status: OrderStatusType;

  readonly command: CommandDto;

  readonly canceled: boolean;

  readonly orderItems: OrderItemDto[];

  constructor(order: Order) {
    this.id = order.id;
    this.status = order.status;
    this.command = order.command ? new CommandDto(order.command) : null;
    this.orderItems = order?.orderItems?.map((orderItem) => new OrderItemDto(orderItem));
    this.canceled = order.canceled;
  }
}
