export interface PermissionProps {
  entity: PermissionEntitiesTypes;
  action: PermissionsActionTypes;
}

export type PermissionsActionTypes = 'VIEW' | 'CREATE' | 'EDIT' | 'REMOVE';

export type PermissionEntitiesTypes =
  | 'CATEGORY'
  | 'COMMAND'
  | 'COMPANY'
  | 'EMPLOYEE'
  | 'ITEM'
  | 'ORDER'
  | 'ORDER-ITEM'
  | 'PERMISSION'
  | 'ROLE'
  | 'ROLE-PERMISSION'
  | 'TABLE';
