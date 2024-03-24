import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  permission: Permission;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
