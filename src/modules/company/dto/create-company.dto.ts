import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'foodGod', description: "Company's name" })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'FG', description: "Company's prefix" })
  @IsString()
  readonly prefix: string;

  @ApiProperty({
    example: "logo's url",
    description: "Company's logo",
    required: false,
  })
  readonly logo: string;

  @ApiProperty({ example: '15240185000189', description: "Company's cnpj" })
  @IsString()
  readonly cnpj: string;
}
