import { SetMetadata } from '@nestjs/common';
import { PermissionProps } from '../interfaces/permissions';

export const PERMISSIONS_KEY = 'PERMISSIONS_KEY';
export const Permissions = (permissions: PermissionProps[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
