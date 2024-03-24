import { ItemDto } from 'src/modules/item/dto/item.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
// import { Item } from 'src/modules/item/entities/item.entity';
// import { Order } from 'src/modules/order/entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

export class OrderItemDto {
  readonly id: number;

  readonly quantity: number;

  readonly order: OrderDto;

  readonly item: ItemDto;

  constructor(orderItem: OrderItem) {
    this.id = orderItem.id;
    this.quantity = orderItem.quantity;
    this.order = orderItem.order ? new OrderDto(orderItem.order) : undefined;
    this.item = orderItem.item ? new ItemDto(orderItem.item) : undefined;
  }
}
