import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Employee } from '../employee/entities/employee.entity';
import EmployeeLogged from 'src/helper/decorators/employeeLogged.decorator';
import EntityManagerParam from 'src/helper/decorators/entityManager.decorator';
import { EntityManager } from 'typeorm';

@ApiBearerAuth()
@ApiTags('Table')
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto, @EmployeeLogged() employeeLogged: Employee) {
    return this.tableService.create(createTableDto, employeeLogged);
  }

  @Get()
  findAll(@EmployeeLogged() employeeLogged: Employee) {
    return this.tableService.findAll(employeeLogged);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tableService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManeger: EntityManager,
  ) {
    return this.tableService.update(+id, updateTableDto, entityManeger, employeeLogged);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @EmployeeLogged() employeeLogged: Employee,
    @EntityManagerParam() entityManeger: EntityManager,
  ) {
    return this.tableService.remove(+id, entityManeger, employeeLogged);
  }
}
