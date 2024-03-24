import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Employee } from '../employee/entities/employee.entity';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { EntityManager } from 'typeorm';
import { Permissions } from 'src/helper/decorators/permission.decorator';

@ApiBearerAuth()
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Permissions([{ entity: 'ORDER', action: 'CREATE' }])
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderService.create(createOrderDto, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'ORDER', action: 'VIEW' }])
  @Get()
  findAll(
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderService.findAll(employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'ORDER', action: 'VIEW' }])
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderService.findOne(+id, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'ORDER', action: 'EDIT' }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderService.update(+id, updateOrderDto, employeeLogged, entityManager);
  }

  @Permissions([{ entity: 'ORDER', action: 'REMOVE' }])
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManager: EntityManager,
  ) {
    return this.orderService.remove(+id, employeeLogged, entityManager);
  }
}
