import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../role/entities/role.entity';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
// import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class RolePermissionService {
  async create(createRolePermissionDto: CreateRolePermissionDto) {
    const permission = await Permission.findOne({
      where: { id: createRolePermissionDto.permissionId },
    });
    const role = await Role.findOne({
      where: { id: createRolePermissionDto.roleId },
    });

    if (!permission) {
      throw new HttpException('Permissão não existe', HttpStatus.PRECONDITION_FAILED);
    }

    if (!role) {
      throw new HttpException('Role não existe', HttpStatus.PRECONDITION_FAILED);
    }

    const rolePermission = new RolePermission();
    rolePermission.permission = permission;
    rolePermission.role = role;

    const rolePermissionData = await rolePermission.save();

    return new RolePermissionDto(rolePermissionData);
  }

  async findAll() {
    const rolePermissions = await RolePermission.find({
      relations: {
        permission: true,
        role: true,
      },
    });
    return rolePermissions.map((rolePermission) => new RolePermissionDto(rolePermission));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rolePermission`;
  // }

  // update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
  //   return `This action updates a #${id} rolePermission`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} rolePermission`;
  // }
}
