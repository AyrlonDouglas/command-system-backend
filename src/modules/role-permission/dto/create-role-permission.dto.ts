import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRolePermissionDto {
  @ApiProperty({ example: 1, description: 'role id' })
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1, description: 'permission id' })
  @IsNumber()
  permissionId: number;
}
