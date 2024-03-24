import { Employee } from '../../employee/entities/employee.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { Item } from 'src/modules/item/entities/item.entity';
import { Table } from 'src/modules/table/entities/table.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  prefix: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  cnpj: string;

  @Column({ default: 0 })
  registeredEmployees: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => Item, (item) => item.company)
  items: Item[];

  @OneToMany(() => Table, (table) => table.company)
  tables: Table[];

  @OneToMany(() => Category, (category) => category.company)
  categories: Category[];

  @OneToMany(() => Role, (role) => role.company)
  roles: Role[];
}

@EventSubscriber()
export class CompanySubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Company;
  }
  async beforeInsert(event: InsertEvent<Company>): Promise<any> {
    const companyWithSamePrefix = await event.manager.findOne(Company, {
      where: { prefix: event.entity.prefix },
    });

    if (companyWithSamePrefix) {
      throw new HttpException(
        'Já existe empresa com este prefixo cadastrada.',
        HttpStatus.CONFLICT,
      );
    }

    const companyWithSameCNPJ = await event.manager.findOne(Company, {
      where: { cnpj: event.entity.cnpj },
    });

    if (companyWithSameCNPJ) {
      throw new HttpException('Já existe empresa com este CNPJ cadastrada.', HttpStatus.CONFLICT);
    }

    const companyWithSameName = await event.manager.findOne(Company, {
      where: { name: event.entity.name },
    });

    if (companyWithSameName) {
      throw new HttpException('Já existe empresa com este nome cadastrada.', HttpStatus.CONFLICT);
    }
  }
}
