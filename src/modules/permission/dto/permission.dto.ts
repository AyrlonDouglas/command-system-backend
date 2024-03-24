import { PermissionEntitiesTypes, PermissionsActionTypes } from 'src/helper/interfaces/permissions';
import { Permission } from '../entities/permission.entity';

export class PermissionDto {
  readonly id: number;

  readonly entity: PermissionEntitiesTypes;

  readonly action: PermissionsActionTypes;

  constructor(permission: Permission) {
    this.id = permission.id;
    this.entity = permission.entity;
    this.action = permission.action;
  }
}
