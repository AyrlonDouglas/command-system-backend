import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Employee } from '../employee/entities/employee.entity';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { EntityManager } from 'typeorm';
import { OrderItemDto } from './dto/order-item.dto';

@ApiBearerAuth()
@ApiTags('Order-item')
@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async create(
    @Body() createOrderItemDto: CreateOrderItemDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return new OrderItemDto(
      await this.orderItemService.create(createOrderItemDto, employeeLogged, entityManager),
    );
  }

  @Get()
  findAll(@EmployeeLogged() employeeLogged: Employee) {
    return this.orderItemService.findAll(employeeLogged);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderItemService.findOne(+id, employeeLogged, entityManager);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderItemService.update(+id, updateOrderItemDto, employeeLogged, entityManager);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderItemService.remove(+id, employeeLogged, entityManager);
  }
}
