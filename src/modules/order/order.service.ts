import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Command } from '../command/entities/command.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Item } from '../item/entities/item.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItemService } from '../order-item/order-item.service';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => OrderItemService)) private readonly orderItemService: OrderItemService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ): Promise<OrderDto> {
    if (createOrderDto.items.length === 0) {
      throw new HttpException(
        'Para cadastrar um pedido você deve adicionar pelo menos um item',
        HttpStatus.BAD_REQUEST,
      );
    }

    const command = await entityManager.findOne(Command, {
      where: { id: createOrderDto.commandId },
    });

    if (!command) {
      throw new HttpException('Comanda não existe', HttpStatus.BAD_REQUEST);
    }

    const order = new Order();
    order.command = command;

    const orderData = await entityManager.save(order);

    for (const item of createOrderDto.items) {
      await this.orderItemService.create(
        { itemId: item.id, orderId: order.id, quantity: item.quantity },
        employeeLogged,
        entityManager,
      );
    }
    const orderDataUpdated = await this.findOne(orderData.id, employeeLogged, entityManager);

    return new OrderDto(orderDataUpdated);
  }

  async findAll(employeeLogged: Employee, entityManager: EntityManager) {
    const orders = await entityManager.find(Order, {
      where: {
        command: { employee: { company: { id: employeeLogged.company.id } } },
      },
      relations: { command: { table: true }, orderItems: { item: true } },
    });
    return orders.map((order) => new OrderDto(order));
  }

  async findOne(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const order = await entityManager.findOne(Order, {
      where: { id, command: { employee: { company: { id: employeeLogged.company.id } } } },
      relations: { command: { table: true }, orderItems: { item: true } },
    });

    if (!order) {
      throw new HttpException('Este pedido não existe.', HttpStatus.BAD_REQUEST);
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ) {
    const order = await this.findOne(id, employeeLogged, entityManager);

    if (order.status !== 'waiting') {
      throw new HttpException(
        'Pedidos com status diferente de aguardando não podem ser alterados.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const itemsToAdd = updateOrderDto.items.filter(
      (item) => !order.orderItems.some((orderItem) => orderItem.item.id === item.id),
    );

    const orderItemsToRemove = order.orderItems.filter(
      (orderItem) => !updateOrderDto.items.some((item) => item.id === orderItem.item.id),
    );

    const orderItemsToModifyQuantity = order.orderItems.filter((orderItem) => {
      const itemFinded = updateOrderDto.items.find((item) => item.id === orderItem.item.id);
      return itemFinded && itemFinded.quantity !== orderItem.quantity;
    });

    const promiseToResolve: Promise<any>[] = [];

    // add
    for (const item of itemsToAdd) {
      const { id: itemId, quantity } = item;
      const { id: orderId } = order;

      const orderItem = this.orderItemService.create(
        { itemId, orderId, quantity },
        employeeLogged,
        entityManager,
      );

      promiseToResolve.push(orderItem);
    }

    // remove
    for (const orderItemToRemove of orderItemsToRemove) {
      const { id } = orderItemToRemove;
      const orderItem = this.orderItemService.remove(id, employeeLogged, entityManager);

      promiseToResolve.push(orderItem);
    }

    // modify
    for (const orderItemMod of orderItemsToModifyQuantity) {
      const { id, item } = orderItemMod;

      const quantity = updateOrderDto.items.find(
        (itemReceveid) => itemReceveid.id === item.id,
      ).quantity;

      const orderItem = this.orderItemService.update(
        id,
        { quantity },
        employeeLogged,
        entityManager,
      );

      promiseToResolve.push(orderItem);
    }

    await Promise.all(promiseToResolve);

    let orderData = await this.findOne(id, employeeLogged, entityManager);

    if (updateOrderDto.status !== orderData.status) {
      const { status } = updateOrderDto;
      orderData.status = status;

      orderData = await entityManager.getRepository(Order).save(orderData);
    }

    return new OrderDto(orderData);
  }

  async remove(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const order = await entityManager.findOne(Order, {
      where: { id, command: { employee: { company: { id: employeeLogged.company.id } } } },
    });

    if (!order) {
      throw new HttpException(`Pedido ${id} não existe`, HttpStatus.BAD_REQUEST);
    }

    return entityManager.delete(Order, id);
  }
}
