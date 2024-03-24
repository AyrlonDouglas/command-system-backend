// import { HttpStatus, HttpException } from '@nestjs/common';
import { PermissionsActionTypes, PermissionEntitiesTypes } from 'src/helper/interfaces/permissions';
import { RolePermission } from 'src/modules/role-permission/entities/role-permission.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  // InsertEvent,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entity: PermissionEntitiesTypes;

  @Column()
  action: PermissionsActionTypes;

  @OneToMany(() => RolePermission, (RolePermission) => RolePermission.role)
  rolePermissions: RolePermission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@EventSubscriber()
export class PermissionSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Permission;
  }

  // async beforeInsert(event: InsertEvent<Permission>): Promise<any> {}
}
