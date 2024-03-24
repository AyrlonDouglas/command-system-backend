import { PermissionProps } from 'src/helper/interfaces/permissions';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

export class AuthPayloadDto {
  readonly id: number;

  readonly employeeCode: string;

  readonly token: string;

  readonly permissions: PermissionProps[];

  constructor(employee: Employee, token?: string) {
    this.id = employee.id;
    this.employeeCode = employee.employeeCode;
    this.token = token;
    this.permissions = employee.role.rolePermissions.map(
      (rolePermission) => rolePermission.permission,
    );
  }
}
