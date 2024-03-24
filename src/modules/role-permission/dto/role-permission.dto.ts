import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

export class RolePermissionDto {
  readonly id: number;

  readonly role: Role;

  readonly permission: Permission;

  constructor(rolePermission: RolePermission) {
    this.id = rolePermission.id;
    this.role = rolePermission.role;
    this.permission = rolePermission.permission;
  }
}
