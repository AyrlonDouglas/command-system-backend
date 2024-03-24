import { Employee } from 'src/modules/employee/entities/employee.entity';
import { OrderDto } from 'src/modules/order/dto/order.dto';
// import { Order } from 'src/modules/order/entities/order.entity';
import { Table } from 'src/modules/table/entities/table.entity';
import { Command } from '../entities/command.entity';

export class CommandDto {
  readonly id: number;

  readonly table: Table;

  readonly employee: Employee;

  readonly orders: OrderDto[];

  readonly requesterCPF: number;

  readonly requesterName: string;

  readonly totalCost: number;

  readonly isActive: boolean;

  constructor(command: Command) {
    this.id = command.id;
    this.employee = command.employee;
    this.orders = command?.orders?.map((order) => new OrderDto(order));
    this.requesterCPF = Number(command.requesterCPF);
    this.requesterName = command.requesterName;
    this.isActive = command.isActive;
    this.table = command.table;
    this.totalCost = command?.orders?.reduce(
      (accOrder, currentOrder) =>
        accOrder +
        currentOrder.orderItems.reduce(
          (accOrderItem, currentOrderItem) =>
            accOrderItem + currentOrderItem.quantity * currentOrderItem.item.price,
          0,
        ),
      0,
    );

    if (command.table) {
      this.table = command.table;
    }
  }
}
