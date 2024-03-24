import { IsString, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: "Employee's first name", example: 'Rodolfo' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Employee's last name", example: 'Silveira' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "Employee's e-mail ",
    example: 'teste@teste.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Employee's Role Id",
    example: 1,
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    description: "Employee's Password",
    example: 'alterarsenhaagora',
    required: false,
  })
  password: string;
}
