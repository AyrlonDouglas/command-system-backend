import { Command } from 'src/modules/command/entities/command.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Table } from '../entities/table.entity';

export class TableDto {
  readonly id: number;
  readonly name: string;
  readonly commands: Command[];
  readonly company: Company;

  constructor(table: Table) {
    this.id = table.id;
    this.name = table.name;
    this.commands = table.commands;
    this.company = table.company;
  }
}
