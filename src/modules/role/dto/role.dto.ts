import { Company } from 'src/modules/company/entities/company.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { RolePermission } from 'src/modules/role-permission/entities/role-permission.entity';
import { Role } from '../entities/role.entity';

export class RoleDto {
  readonly id: number;

  readonly name: string;

  readonly employees: Employee[];

  readonly rolePermissions: RolePermission[];

  readonly company: Company;

  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.employees = role.employees;
    this.rolePermissions = role.rolePermissions;
    this.company = role.company;
  }
}
