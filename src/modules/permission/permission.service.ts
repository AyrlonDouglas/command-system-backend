import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionDto } from './dto/permission.dto';
// import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  async create(createPermissionDto: CreatePermissionDto, entityManager: EntityManager) {
    for (const permission of createPermissionDto.permissions) {
      const permissionExists = await Permission.findOneBy({
        entity: permission.entity,
        action: permission.action,
      });

      if (permissionExists) {
        throw new HttpException(
          `A permissão entity ${permissionExists.entity} action ${permissionExists.action} já existe`,
          HttpStatus.CONFLICT,
        );
      }
    }

    const permissionsData: Promise<Permission>[] = [];

    for (const permission of createPermissionDto.permissions) {
      const newPermission = new Permission();
      newPermission.entity = permission.entity;
      newPermission.action = permission.action;

      const permissionSaved = entityManager.save(newPermission);
      permissionsData.push(permissionSaved);
    }

    const permissionsResolved = await Promise.all(permissionsData);

    return permissionsResolved.map((permission) => new PermissionDto(permission));
  }

  async findAll(entityManager: EntityManager) {
    const permissions = await entityManager.find(Permission);

    return permissions.map((permission) => new PermissionDto(permission));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} permission`;
  // }

  // update(id: number, updatePermissionDto: UpdatePermissionDto) {
  //   return `This action updates a #${id} permission`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} permission`;
  // }
}
