import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Company } from '../company/entities/company.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Permission } from '../permission/entities/permission.entity';
import { RolePermission } from '../role-permission/entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  async create(createRoleDto: CreateRoleDto, employeeLogged: Employee) {
    const company = await Company.findOne({
      where: { id: employeeLogged.company.id },
    });

    if (!company)
      throw new HttpException('Não existe esta companhia', HttpStatus.PRECONDITION_FAILED);

    const roleName = await Role.findOne({
      where: { company: { id: employeeLogged.company.id }, name: createRoleDto.name },
    });

    if (roleName) {
      throw new HttpException('Já existe função com esse nome', HttpStatus.CONFLICT);
    }

    const role = new Role();
    role.name = createRoleDto.name;
    role.company = company;

    const roleData = await role.save();

    const permissions = await Promise.all(
      createRoleDto.permissionsIds.map((permissionId) =>
        Permission.findOne({ where: { id: permissionId } }),
      ),
    );

    await Promise.all(
      permissions.map((permition) => {
        const rolePermition = new RolePermission();
        rolePermition.permission = permition;
        rolePermition.role = roleData;
        return rolePermition.save();
      }),
    );

    const roleWithPermissions = await Role.findOne({
      where: { id: roleData.id },
      relations: { rolePermissions: { permission: true } },
    });

    return new RoleDto(roleWithPermissions);
  }

  async findAll(employeeLoged: Employee) {
    const roles = await Role.find({
      where: { company: { id: employeeLoged.company.id } },
      relations: { rolePermissions: { permission: true } },
    });
    return roles.map((role) => new RoleDto(role));
  }

  async findOne(id: number, employeeLogged: Employee) {
    const role = await Role.findOne({
      where: { id, company: { id: employeeLogged.company.id } },
      relations: { rolePermissions: { permission: true } },
    });

    if (!role) {
      throw new HttpException('Não existe função com o id ' + id, HttpStatus.BAD_REQUEST);
    }

    return new RoleDto(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto, employeeLogged: Employee) {
    const company = await Company.findOneBy({ id: employeeLogged.company.id });

    if (!company) {
      throw new HttpException('Não existe esta companhia', HttpStatus.PRECONDITION_FAILED);
    }

    const role = await Role.findOne({
      where: { id: Number(id) },
      relations: { rolePermissions: { permission: true } },
    });

    if (!role) {
      throw new HttpException('Função não existe', HttpStatus.PRECONDITION_FAILED);
    }

    const permissionsIdsReceived = updateRoleDto.permissionsIds.map((id) => Number(id));

    const existingPermissionsIds = role.rolePermissions.map(
      (rolePermission) => rolePermission.permission.id,
    );

    const permissionsIdsToWithdraw = existingPermissionsIds.filter(
      (permissionId) => !permissionsIdsReceived.includes(permissionId),
    );

    const permissionsIdsToAdd = permissionsIdsReceived.filter(
      (permissionId) => !existingPermissionsIds.includes(permissionId),
    );

    if (permissionsIdsToWithdraw.length > 0) {
      const permissionsToRemove = role.rolePermissions.filter(({ permission }) =>
        permissionsIdsToWithdraw.includes(permission.id),
      );

      await RolePermission.remove(permissionsToRemove);
    }

    if (permissionsIdsToAdd.length > 0) {
      const permissionsToAdd = await Promise.all(
        permissionsIdsToAdd.map((permitionsId) => Permission.findOneBy({ id: permitionsId })),
      );

      await Promise.all(
        permissionsToAdd.map((permissionToAdd) => {
          const rolePermission = new RolePermission();
          rolePermission.permission = permissionToAdd;
          rolePermission.role = role;

          return rolePermission.save();
        }),
      );
    }

    if (role.name !== updateRoleDto.name) {
      role.name = updateRoleDto.name;
      await role.save();
    }

    return this.findOne(id, employeeLogged);
  }

  async remove(id: number, employeeLogged: Employee) {
    const company = await Company.findOne({ where: { id: employeeLogged.company.id } });

    if (!company) {
      throw new HttpException('Companhia não existe', HttpStatus.PRECONDITION_FAILED);
    }

    const role = await Role.findOne({ where: { id }, relations: { employees: true } });
    if (!role) {
      throw new HttpException('Função não existe', HttpStatus.PRECONDITION_FAILED);
    }

    if (role.employees.length > 0) {
      throw new HttpException(
        'Você não pode excluir uma função em uso por algum colaborador!',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await role.remove();
  }
}
