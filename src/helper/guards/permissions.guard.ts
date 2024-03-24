import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { PermissionProps } from '../interfaces/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionProps[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();

    const employeeLogged: Employee = request.employeeLogged;

    const role = await Role.findOne({
      where: { id: employeeLogged.role.id, company: { id: employeeLogged.company.id } },
      relations: { rolePermissions: { permission: true } },
    });

    const employeeLoggedPermissions = role.rolePermissions.map((rolePermission) => {
      return { entity: rolePermission.permission.entity, action: rolePermission.permission.action };
    });

    return requiredPermissions.every((requiredPermission) =>
      employeeLoggedPermissions.some(
        (employeeLoggedPermission) =>
          employeeLoggedPermission.action === requiredPermission.action &&
          employeeLoggedPermission.entity === requiredPermission.entity,
      ),
    );
  }
}
