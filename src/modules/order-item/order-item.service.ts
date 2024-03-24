import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { EntityManager } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Item } from '../item/entities/item.entity';
import { OrderService } from '../order/order.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemDto } from './dto/order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @Inject(forwardRef(() => OrderService)) private readonly orderService: OrderService,
  ) {}

  async create(
    createOrderItemDto: CreateOrderItemDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ) {
    const order = await this.orderService.findOne(
      createOrderItemDto.orderId,
      employeeLogged,
      entityManager,
    );
    const item = await entityManager.findOne(Item, {
      where: { id: createOrderItemDto.itemId, company: { id: employeeLogged.company.id } },
    });

    if (!item) {
      throw new HttpException(
        `Item de id ${createOrderItemDto.itemId} não existe`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!item.avaliable) {
      throw new HttpException(
        `Item de id ${createOrderItemDto.itemId} não está disponível`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (order.orderItems.find((orderItem) => orderItem.item.id === item.id)) {
      const orderItem = order.orderItems.find((orderItem) => orderItem.item.id === item.id);
      throw new HttpException(
        `${orderItem.item.name} já incluso, modifique o pedido`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const orderItem = await entityManager.insert(OrderItem, {
      item,
      order: order,
      quantity: createOrderItemDto.quantity,
    });

    return this.findOne(orderItem.raw.insertId, employeeLogged, entityManager);
  }

  async findAll(employeeLogged: Employee) {
    const orderItems = await OrderItem.find({
      where: { item: { company: { id: employeeLogged.company.id } } },
      relations: { order: true, item: true },
    });
    return orderItems.map((orderItem) => new OrderItemDto(orderItem));
  }

  async findOne(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const orderItem = await entityManager.findOne(OrderItem, {
      where: { id, item: { company: { id: employeeLogged.company.id } }, order: true },
      relations: { item: true },
    });
    if (!orderItem) {
      throw new HttpException(`orderItem de id ${id} não existe`, HttpStatus.BAD_REQUEST);
    }

    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
    employeeLogged: Employee,
    entityManager: EntityManager,
  ) {
    const orderItem = await this.findOne(id, employeeLogged, entityManager);

    if (!orderItem) {
      throw new HttpException(`orderItem de id ${id} não existe`, HttpStatus.BAD_REQUEST);
    }

    orderItem.quantity = updateOrderItemDto.quantity;
    return entityManager.save(orderItem);
  }

  async remove(id: number, employeeLogged: Employee, entityManager: EntityManager) {
    const orderItem = await this.findOne(id, employeeLogged, entityManager);
    if (!orderItem) {
      throw new HttpException(`orderItem de id ${id} não existe`, HttpStatus.BAD_REQUEST);
    }

    return await entityManager.getRepository(OrderItem).delete(id);
  }
}
