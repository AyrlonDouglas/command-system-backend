import { Company } from 'src/modules/company/entities/company.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { RolePermission } from 'src/modules/role-permission/entities/role-permission.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.role)
  employees: Employee[];

  @OneToMany(() => RolePermission, (RolePermission) => RolePermission.role)
  rolePermissions: RolePermission[];

  @ManyToOne(() => Company, (company) => company.roles)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
