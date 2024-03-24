import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermission } from './entities/role-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
})
export class RolePermissionModule {}
