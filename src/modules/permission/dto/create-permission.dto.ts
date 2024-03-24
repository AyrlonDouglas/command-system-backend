import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ALLPermissions } from 'src/helper/constants/permissions';
import { PermissionProps } from 'src/helper/interfaces/permissions';

export class CreatePermissionDto {
  @ApiProperty({ example: ALLPermissions, description: 'name permissions' })
  @IsArray()
  permissions: PermissionProps[];
}
