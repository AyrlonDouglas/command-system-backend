import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { EntityManager } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { TableDto } from './dto/table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  async create(createTableDto: CreateTableDto, employeeLogged: Employee) {
    const table = new Table();
    table.name = createTableDto.name;
    table.company = employeeLogged.company;

    const tableData = await table.save();

    return new TableDto(tableData);
  }

  async findAll(employeeLogged: Employee) {
    const tables = await Table.find({
      where: { company: { id: employeeLogged.company.id } },
    });

    return tables.map((table) => new TableDto(table));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} table`;
  // }

  async update(
    id: number,
    updateTableDto: UpdateTableDto,
    entityManager: EntityManager,
    employeeLogged: Employee,
  ) {
    const table = await entityManager.findOne(Table, {
      where: { id, company: { id: employeeLogged.company.id } },
    });

    if (!table) {
      throw new HttpException('Mesa não existe', HttpStatus.BAD_REQUEST);
    }

    table.name = updateTableDto.name;

    const tableData = await entityManager.save(table);

    return new TableDto(tableData);
  }

  async remove(id: number, entityManager: EntityManager, employeeLogged: Employee) {
    const table = await entityManager.findOne(Table, {
      where: { id, company: { id: employeeLogged.company.id } },
    });

    if (!table) {
      throw new HttpException('Mesa não existe', HttpStatus.BAD_REQUEST);
    }

    return entityManager.remove(table);
  }
}
