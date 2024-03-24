import { Company } from '../../company/entities/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  UpdateEvent,
} from 'typeorm';
// import { EEmployeeTypes, TEmployeeTypes } from 'src/helper/enum/employeeTypes';
import { Command } from 'src/modules/command/entities/command.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/modules/role/entities/role.entity';
@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  employeeCode: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Company, (company) => company.employees)
  company: Company;

  @OneToMany(() => Command, (command) => command.employee)
  commands: Command[];

  @ManyToOne(() => Role, (role) => role.employees)
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@EventSubscriber()
export class EmployeeSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Employee;
  }

  async beforeInsert(event: InsertEvent<Employee>): Promise<any> {
    const company = await event.manager.findOne(Company, {
      where: { id: event.entity.company.id },
    });

    company.registeredEmployees += 1;
    await event.manager.save(company);

    event.manager.update(
      Company,
      { id: event.entity.company.id },
      {
        registeredEmployees: company.registeredEmployees,
      },
    );

    event.entity.employeeCode = `${event.entity.company.prefix}${company.registeredEmployees}`;

    const pass = await bcrypt.hash(
      event.entity.password ?? 'alterarsenhaagora',
      await bcrypt.genSalt(),
    );
    event.entity.password = pass;
  }

  async beforeUpdate(event: UpdateEvent<Employee>): Promise<any> {
    if (event.entity.password) {
      const pass = await bcrypt.hash(event.entity.password, await bcrypt.genSalt());
      event.entity.password = pass;
    }
  }
}
