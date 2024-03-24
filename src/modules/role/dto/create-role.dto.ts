import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Garçom', description: "role's name" })
  @IsString()
  name: string;

  @ApiProperty({ example: [1, 2, 3], description: "id's permissions of role" })
  @IsArray()
  permissionsIds: number[];
}
